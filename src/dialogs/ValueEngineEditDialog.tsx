import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';
import {
  type AudienceLevel,
  type ProductNode,
  type MetricDefinition,
  type BasketSectionDefinition,
  VALUE_ENGINE_CONFIG,
  DEFAULT_AUDIENCE_TABS,
  getMetricsForNode,
  getDefaultMetricsByLevel,
  audienceLabelMap
} from '../data/valueEngineConfig';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const collectLeafIds = (node: ProductNode): string[] => {
  if (!node.children || node.children.length === 0) {
    return [node.id];
  }
  return node.children.flatMap((child) => collectLeafIds(child));
};

const buildProductMaps = (nodes: ProductNode[]) => {
  const nodeMap: Record<string, ProductNode> = {};
  const parentMap: Record<string, string | null> = {};

  const traverse = (list: ProductNode[], parent: string | null) => {
    list.forEach((node) => {
      nodeMap[node.id] = node;
      parentMap[node.id] = parent;
      if (node.children && node.children.length) {
        traverse(node.children, node.id);
      }
    });
  };

  traverse(nodes, null);
  return { nodeMap, parentMap };
};

const collectAncestors = (nodeId: string, parentMap: Record<string, string | null>): string[] => {
  const ancestors: string[] = [];
  let current = parentMap[nodeId];
  while (current) {
    ancestors.push(current);
    current = parentMap[current];
  }
  return ancestors;
};

const getPathLabels = (
  nodeId: string,
  nodeMap: Record<string, ProductNode>,
  parentMap: Record<string, string | null>
): string[] => {
  const labels: string[] = [];
  let current: string | null = nodeId;
  while (current) {
    const node = nodeMap[current];
    if (node) {
      labels.unshift(node.label);
    }
    current = parentMap[current] ?? null;
  }
  return labels;
};

interface MetricState extends MetricDefinition {
  weight: number;
}

type MetricStateByLevel = Record<AudienceLevel, Record<string, MetricState>>;

const buildMetricState = (
  selectedLeafIds: string[],
  nodeMap: Record<string, ProductNode>,
  parentMap: Record<string, string | null>,
  previous?: MetricStateByLevel
): MetricStateByLevel => {
  const levels = DEFAULT_AUDIENCE_TABS;
  const next: MetricStateByLevel = levels.reduce((acc, level) => {
    const defaults = getDefaultMetricsByLevel([level])[level] ?? [];
    const metricMap: Record<string, MetricState> = {};

    defaults.forEach((metric) => {
      metricMap[metric.id] = { ...metric, weight: metric.defaultWeight };
    });

    const relevantNodeIds = new Set<string>();
    selectedLeafIds.forEach((leafId) => {
      relevantNodeIds.add(leafId);
      collectAncestors(leafId, parentMap).forEach((ancestor) => relevantNodeIds.add(ancestor));
    });

    relevantNodeIds.forEach((nodeId) => {
      const node = nodeMap[nodeId];
      if (!node) return;
      const metrics = getMetricsForNode(node, level);
      metrics.forEach((metric) => {
        if (!metricMap[metric.id]) {
          metricMap[metric.id] = { ...metric, weight: metric.defaultWeight };
        }
      });
    });

    const previousLevelState = previous?.[level];
    if (previousLevelState) {
      Object.keys(metricMap).forEach((metricId) => {
        const previousMetric = previousLevelState[metricId];
        if (previousMetric) {
          metricMap[metricId] = {
            ...metricMap[metricId],
            weight: previousMetric.weight,
            visualize: previousMetric.visualize
          };
        }
      });
    }

    acc[level] = metricMap;
    return acc;
  }, {} as MetricStateByLevel);

  return next;
};

interface SectionMetricState {
  id: string;
  label: string;
  weight: number;
  visualize: boolean;
  defaultWeight: number;
}

type SectionStateByLevel = Partial<Record<AudienceLevel, Record<string, SectionMetricState>>>;

const buildSectionState = (section: BasketSectionDefinition): SectionStateByLevel => {
  const state: SectionStateByLevel = {};
  DEFAULT_AUDIENCE_TABS.forEach((level) => {
    const metrics = section.metricsByLevel[level];
    if (!metrics) return;
    state[level] = metrics.reduce<Record<string, SectionMetricState>>((acc, metric) => {
      acc[metric.id] = {
        id: metric.id,
        label: metric.label,
        weight: metric.defaultWeight,
        visualize: metric.visualize,
        defaultWeight: metric.defaultWeight
      };
      return acc;
    }, {});
  });
  return state;
};

const renderTabs = (
  availableLevels: AudienceLevel[],
  activeLevel: AudienceLevel,
  onChange: (level: AudienceLevel) => void,
  levelHasMetrics: (level: AudienceLevel) => boolean
) => (
  <div style={{ display: 'inline-flex', backgroundColor: 'rgba(148, 163, 184, 0.1)', borderRadius: '9999px', padding: '4px' }}>
    {availableLevels.map((level) => {
      const hasMetrics = levelHasMetrics(level);
      return (
        <button
          key={level}
          onClick={() => hasMetrics && onChange(level)}
          style={{
            minWidth: '72px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: 'none',
            cursor: hasMetrics ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            fontWeight: 500,
            color: activeLevel === level ? '#0f172a' : hasMetrics ? '#e2e8f0' : '#64748b',
            backgroundColor: activeLevel === level ? '#38bdf8' : 'transparent',
            transition: 'all 0.15s ease'
          }}
        >
          {audienceLabelMap[level]}
        </button>
      );
    })}
  </div>
);

export const ValueEngineEditDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'value-engine-edit';

  const [basketName, setBasketName] = useState('Odaiazol');
  const [basketWeight, setBasketWeight] = useState('7');
  const [therapeuticArea] = useState(VALUE_ENGINE_CONFIG.therapeuticArea);
  const [specialties, setSpecialties] = useState('Oncology');
  const [indication, setIndication] = useState('');
  const [indicationManuallyEdited, setIndicationManuallyEdited] = useState(false);

  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(['tot-oncology', 'breast-mkt', 'her2-therapies']);
  const [selectedLeafIds, setSelectedLeafIds] = useState<string[]>(['odaiazol']);

  const [activeMetricLevel, setActiveMetricLevel] = useState<AudienceLevel>('hcp');
  const [competitiveLevel, setCompetitiveLevel] = useState<AudienceLevel>('hcp');
  const [patientLevel, setPatientLevel] = useState<AudienceLevel>('hcp');

  const productTree = VALUE_ENGINE_CONFIG.productTree;
  const { nodeMap, parentMap } = useMemo(() => buildProductMaps(productTree), [productTree]);

  const [metricState, setMetricState] = useState<MetricStateByLevel>(() =>
    buildMetricState(selectedLeafIds, nodeMap, parentMap)
  );

  const primaryCompetitiveSection = VALUE_ENGINE_CONFIG.competitiveSections[0];
  const primaryPatientSection = VALUE_ENGINE_CONFIG.patientSections[0];

  const [competitiveState, setCompetitiveState] = useState<SectionStateByLevel>(() =>
    primaryCompetitiveSection ? buildSectionState(primaryCompetitiveSection) : {}
  );
  const [patientState, setPatientState] = useState<SectionStateByLevel>(() =>
    primaryPatientSection ? buildSectionState(primaryPatientSection) : {}
  );

  useEffect(() => {
    setMetricState((prev) => buildMetricState(selectedLeafIds, nodeMap, parentMap, prev));
    setIndicationManuallyEdited(false);
  }, [selectedLeafIds.join('|'), nodeMap, parentMap]);

  useEffect(() => {
    if (indicationManuallyEdited) return;
    const primaryLeaf = selectedLeafIds[0];
    if (!primaryLeaf) return;
    const path = getPathLabels(primaryLeaf, nodeMap, parentMap);
    setIndication(path.slice(1).join(' › ') || path.join(' › '));
  }, [selectedLeafIds.join('|'), indicationManuallyEdited, nodeMap, parentMap]);

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleToggleSelection = (node: ProductNode, shouldDeselect: boolean) => {
    const leafIds = collectLeafIds(node);
    setSelectedLeafIds((prev) => {
      const next = new Set(prev);
      if (shouldDeselect) {
        leafIds.forEach((leaf) => next.delete(leaf));
        if (next.size === 0) {
          return prev;
        }
      } else {
        leafIds.forEach((leaf) => next.add(leaf));
      }
      return Array.from(next);
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedLeafIds((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const filtered = prev.filter((id) => id !== productId);
      return filtered.length > 0 ? filtered : prev;
    });
  };

  const currentMetrics = useMemo(() => {
    const metrics = metricState[activeMetricLevel] || {};
    return Object.values(metrics).sort((a, b) => a.name.localeCompare(b.name));
  }, [metricState, activeMetricLevel]);

  const updateMetricWeight = (level: AudienceLevel, metricId: string, weight: number) => {
    setMetricState((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [metricId]: {
          ...prev[level][metricId],
          weight
        }
      }
    }));
  };

  const toggleMetricVisualize = (level: AudienceLevel, metricId: string) => {
    setMetricState((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [metricId]: {
          ...prev[level][metricId],
          visualize: !prev[level][metricId].visualize
        }
      }
    }));
  };

  const updateSectionMetric = (
    setter: React.Dispatch<React.SetStateAction<SectionStateByLevel>>,
    level: AudienceLevel,
    metricId: string,
    update: Partial<SectionMetricState>
  ) => {
    setter((prev) => {
      const levelMetrics = prev[level];
      if (!levelMetrics) return prev;
      return {
        ...prev,
        [level]: {
          ...levelMetrics,
          [metricId]: {
            ...levelMetrics[metricId],
            ...update
          }
        }
      };
    });
  };

  const renderProductNode = (node: ProductNode, level = 0) => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.includes(node.id);
    const leafIds = collectLeafIds(node);
    const selectedCount = leafIds.filter((leafId) => selectedLeafIds.includes(leafId)).length;
    const isChecked = selectedCount === leafIds.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < leafIds.length;

    return (
      <div key={node.id}>
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
            paddingLeft: `${level * 20 + 8}px`,
          cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand(node.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span style={{ width: '14px' }} />
          )}

          <input
            type="checkbox"
            checked={isChecked}
            ref={(el) => {
              if (el) {
                el.indeterminate = isIndeterminate;
              }
            }}
            onChange={(e) => {
              e.stopPropagation();
              handleToggleSelection(node, isChecked);
            }}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              accentColor: '#38bdf8'
            }}
          />

          <span
            style={{
            fontSize: '13px',
              color: '#e2e8f0',
              fontWeight: level === 0 ? 600 : 400,
              flex: 1
            }}
            onClick={() => {
              if (hasChildren) {
                handleToggleExpand(node.id);
              } else {
                handleToggleSelection(node, isChecked);
              }
            }}
          >
            {node.label}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderProductNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (
    section: BasketSectionDefinition | undefined,
    sectionState: SectionStateByLevel,
    activeLevel: AudienceLevel,
    onLevelChange: (level: AudienceLevel) => void,
    onUpdate: (
      level: AudienceLevel,
      metricId: string,
      update: Partial<SectionMetricState>
    ) => void
  ) => {
    if (!section) return null;
    const availableLevels = section.tabs ?? DEFAULT_AUDIENCE_TABS;
    const metricsForLevel = sectionState[activeLevel];
    const metricsList = metricsForLevel
      ? Object.values(metricsForLevel).sort((a, b) => a.label.localeCompare(b.label))
      : [];

    return (
      <div style={{ marginBottom: '18px' }}>
        <div
            style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '10px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                {section.label}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Basket weight: {section.basketWeight}
                {section.products && section.products.length > 0 && (
                  <span style={{ marginLeft: '12px' }}>
                    Products: {section.products.join(', ')}
                  </span>
                )}
              </div>
            </div>
            {renderTabs(availableLevels, activeLevel, onLevelChange, (level) => !!sectionState[level])}
        </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(148, 163, 184, 0.08)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>
                    Markets
                  </th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    Scoring weight
                  </th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    Visualize
                  </th>
                </tr>
              </thead>
              <tbody>
                {metricsList.map((metric) => (
                  <tr key={`${activeLevel}-${metric.id}`}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#e2e8f0' }}>
                      {metric.label}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={metric.weight}
                          onChange={(e) =>
                            onUpdate(activeLevel, metric.id, {
                              weight: clamp(parseInt(e.target.value, 10) || 0, 0, 100)
                            })
                          }
                          style={{
                            width: '80px',
                            padding: '8px 0',
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '6px',
                            color: '#f1f5f9',
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>%</span>
          </div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={metric.visualize}
                        onChange={() =>
                          onUpdate(activeLevel, metric.id, { visualize: !metric.visualize })
                        }
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#38bdf8'
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {metricsList.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: '14px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                      No metrics configured for this level.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setActiveModal(null)}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
          position: 'fixed',
          inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 1000
          }}
        />
        <Dialog.Content
          style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
            width: '95vw',
            maxWidth: '980px',
            maxHeight: '90vh',
          overflow: 'auto',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            padding: '28px 32px',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.6)',
            zIndex: 1001
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <Dialog.Title style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                New Project: Odaiazol – Establish Product
            </Dialog.Title>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                Configure product selections and adjust metric weighting across HCP, FSA, and Regional views.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: 0.42, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>Portfolio Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
              <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Basket Name</label>
                <input
                  value={basketName}
                  onChange={(e) => setBasketName(e.target.value)}
                  style={{
                    width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: '#0b1220',
                        color: '#f8fafc',
                        fontSize: '13px'
                      }}
                />
              </div>
              <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Basket Weight (0-10)</label>
                <input
                  type="number"
                      min={0}
                      max={10}
                  value={basketWeight}
                  onChange={(e) => setBasketWeight(e.target.value)}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: '#0b1220',
                        color: '#f8fafc',
                        fontSize: '13px'
                      }}
                />
              </div>
            </div>
              </section>

              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Basket Configurations</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
                  Assign products to reveal the metrics that power scoring across each audience view.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Therapeutic Area</label>
                  <input
                value={therapeuticArea}
                    readOnly
                style={{
                  width: '100%',
                  padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(148, 163, 184, 0.15)',
                      backgroundColor: '#0b1220',
                      color: '#f8fafc',
                      fontSize: '13px'
                    }}
                  />
            </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Selected Products</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedLeafIds.map((id) => {
                      const node = nodeMap[id];
                      return (
                        <span
                          key={id}
                style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 10px',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            borderRadius: '9999px',
                            fontSize: '12px'
                          }}
                        >
                          {node?.label ?? id}
                          <button
                            onClick={() => handleRemoveProduct(id)}
                  style={{
                              background: 'none',
                              border: 'none',
                              color: '#38bdf8',
                              cursor: selectedLeafIds.length > 1 ? 'pointer' : 'not-allowed'
                            }}
                            disabled={selectedLeafIds.length <= 1}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
              </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                  maxHeight: '300px',
                    overflow: 'auto'
                  }}
                >
                  {productTree.map((node) => renderProductNode(node))}
                </div>
              </section>

              <section>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Indication Path</label>
                    <input
                value={indication}
                      onChange={(e) => {
                        setIndication(e.target.value);
                        setIndicationManuallyEdited(true);
                      }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: '#0b1220',
                        color: '#f8fafc',
                        fontSize: '13px'
                      }}
                    />
            </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Specialty</label>
              <select
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: '#0b1220',
                        color: '#f8fafc',
                        fontSize: '13px'
                      }}
              >
                <option value="Oncology">Oncology</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Radiation Oncology">Radiation Oncology</option>
              </select>
                  </div>
                </div>
              </section>
            </div>

            <div style={{ flex: 0.58, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
              marginBottom: '16px'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Metrics</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                      Adjust weights and visibility for the metrics surfaced by the selected products.
                    </p>
              </div>
                  {renderTabs(DEFAULT_AUDIENCE_TABS, activeMetricLevel, setActiveMetricLevel, (level) => !!metricState[level])}
          </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.25)'
                  }}
                >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                      <tr style={{ backgroundColor: 'rgba(148, 163, 184, 0.08)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>
                          Metric Name
                    </th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                          Scoring Weight
                    </th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                      Visualize
                    </th>
                  </tr>
                </thead>
                <tbody>
                      {currentMetrics.map((metric) => (
                        <tr key={`${activeMetricLevel}-${metric.id}`}>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', fontWeight: 500 }}>
                        {metric.name}
                      </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                                min={0}
                                max={100}
                            value={metric.weight}
                                onChange={(e) =>
                                  updateMetricWeight(
                                    activeMetricLevel,
                                    metric.id,
                                    clamp(parseInt(e.target.value, 10) || 0, 0, 100)
                                  )
                                }
                            style={{
                              width: '90px',
                                  padding: '8px 0',
                                  backgroundColor: '#0b1220',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '8px',
                                  color: '#f8fafc',
                              textAlign: 'center',
                                  fontSize: '13px'
                                }}
                              />
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>%</span>
                        </div>
                      </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={metric.visualize}
                              onChange={() => toggleMetricVisualize(activeMetricLevel, metric.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                                cursor: 'pointer',
                                accentColor: '#38bdf8'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                      {currentMetrics.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                            Select products in the tree to reveal available metrics.
                    </td>
                  </tr>
                      )}
                </tbody>
              </table>
            </div>
              </section>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {renderSection(
                  primaryCompetitiveSection,
                  competitiveState,
                  competitiveLevel,
                  setCompetitiveLevel,
                  (level, id, update) => updateSectionMetric(setCompetitiveState, level, id, update)
                )}

                {renderSection(
                  primaryPatientSection,
                  patientState,
                  patientLevel,
                  setPatientLevel,
                  (level, id, update) => updateSectionMetric(setPatientState, level, id, update)
                )}
                      </div>
                      </div>
            </div>

          <div
            style={{
              display: 'flex',
            justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '28px',
              borderTop: '1px solid rgba(148, 163, 184, 0.15)',
              paddingTop: '20px'
            }}
          >
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Save Configuration
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
