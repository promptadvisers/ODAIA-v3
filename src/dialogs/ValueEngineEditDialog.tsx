import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { useAppStore, type MetricState } from '../store/appStore';
import {
  type AudienceLevel,
  type ProductNode,
  type BasketSectionDefinition,
  VALUE_ENGINE_CONFIG,
  DEFAULT_AUDIENCE_TABS,
  audienceLabelMap
} from '../data/valueEngineConfig';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const collectLeafIds = (node: ProductNode): string[] => {
  if (!node.children || node.children.length === 0) {
    return [node.id];
  }
  return node.children.flatMap((child) => collectLeafIds(child));
};

const flattenNodeIds = (node: ProductNode): string[] => {
  if (!node.children || node.children.length === 0) {
    return [node.id];
  }
  return [node.id, ...node.children.flatMap(flattenNodeIds)];
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

const getPathFromNode = (nodeId: string, nodeMap: Record<string, ProductNode>, parentMap: Record<string, string | null>): string => {
  const segments: string[] = [];
  let current: string | null = nodeId;
  while (current) {
    const node = nodeMap[current];
    if (node) {
      segments.unshift(node.label);
    }
    current = parentMap[current] ?? null;
  }
  return segments.slice(1).join(' › ') || segments.join(' › ');
};

const OBJECTIVE_TABS = [
  { id: 'odaiazol', label: 'Odaiazol Objective' },
  { id: 'vectoral', label: 'Vectoral Objective' }
];

const MAX_WEIGHT = 100;

const enrichMetricsWithLabels = (
  section: BasketSectionDefinition,
  sectionState: Record<AudienceLevel, MetricState[]>
): Record<AudienceLevel, Array<{ id: string; label: string; weight: number; visualize: boolean }>> => {
  const result = {} as Record<AudienceLevel, Array<{ id: string; label: string; weight: number; visualize: boolean }>>;

  for (const level of ['hcp', 'fsa', 'regional'] as AudienceLevel[]) {
    const metrics = sectionState[level] ?? [];
    result[level] = metrics.map(metric => {
      const definition = section.metricsByLevel[level]?.find(m => m.id === metric.id);
      return {
        id: metric.id,
        label: definition?.label ?? metric.id,
        weight: metric.weight,
        visualize: metric.visualize
      };
    });
  }

  return result;
};

export const ValueEngineEditDialog: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    objectives,
    activeObjectiveId,
    setActiveObjective,
    updateObjectiveState,
    addTemporaryObjective,
    removeTemporaryObjective,
    isTemporaryObjective,
    projectName
  } = useAppStore();
  const isOpen = activeModal === 'value-engine-edit';

  const productTree = VALUE_ENGINE_CONFIG.productTree;
  const { nodeMap, parentMap } = useMemo(() => buildProductMaps(productTree), [productTree]);

  const availableTabs = React.useMemo(() => {
    const baseTabs = OBJECTIVE_TABS.filter((tab) => Boolean(objectives[tab.id]));
    const additionalDrafts = Object.values(objectives)
      .filter((objective) => objective.id.startsWith('custom-'))
      .map((objective) => ({ id: objective.id, label: 'Draft Objective' }));
    const merged = [...baseTabs];
    additionalDrafts.forEach((draft) => {
      if (!merged.find((tab) => tab.id === draft.id)) {
        merged.push(draft);
      }
    });
    return merged;
  }, [objectives]);

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (objectives[activeObjectiveId]) return activeObjectiveId;
    return availableTabs[0]?.id ?? '';
  });

  const activeObjective = objectives[activeTab];

  React.useEffect(() => {
    if (!activeTab) {
      const defaultTab = availableTabs[0]?.id;
      if (defaultTab) {
        setActiveTab(defaultTab);
        setActiveObjective(defaultTab);
      }
      return;
    }

    if (objectives[activeTab]) {
      setActiveObjective(activeTab);
    }
  }, [activeTab, objectives, availableTabs, setActiveObjective]);

  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(() => {
    if (!activeObjective) return ['tot-oncology'];
    const ancestors = new Set<string>();
    activeObjective.selectedProductIds.forEach((leaf) => {
      collectAncestors(leaf, parentMap).forEach((ancestor) => ancestors.add(ancestor));
    });
    return Array.from(ancestors);
  });

  const [activeMetricLevel, setActiveMetricLevel] = useState<AudienceLevel>('hcp');
  const [competitiveLevel, setCompetitiveLevel] = useState<AudienceLevel>('hcp');
  const [patientLevel, setPatientLevel] = useState<AudienceLevel>('hcp');

  if (!isOpen || !activeObjective) {
    return null;
  }

  const isDraft = isTemporaryObjective(activeObjectiveId);

  const handleAddObjective = () => {
    const newId = addTemporaryObjective();
    setActiveObjective(newId);
  };

  const handleCloseDraft = () => {
    removeTemporaryObjective(activeObjectiveId);
  };

  const currentMetrics = activeObjective.metricsByLevel[activeMetricLevel] ?? [];
  const competitiveSection = VALUE_ENGINE_CONFIG.competitiveSections[0];
  const patientSection = VALUE_ENGINE_CONFIG.patientSections[0];
  const objectiveCompetitive = activeObjective.competitiveSections[competitiveSection.id] ?? { hcp: [], fsa: [], regional: [] };
  const objectivePatient = activeObjective.patientSections[patientSection.id] ?? { hcp: [], fsa: [], regional: [] };

  const handleSelectProduct = (node: ProductNode, deselect: boolean) => {
    const leafIds = collectLeafIds(node);
    const nextSelection = new Set(activeObjective.selectedProductIds);

    if (deselect) {
      leafIds.forEach((leaf) => nextSelection.delete(leaf));
    } else {
      leafIds.forEach((leaf) => nextSelection.add(leaf));
    }

    updateObjectiveState(activeTab, {
      selectedProductIds: Array.from(nextSelection),
      indicationPath: nextSelection.size > 0 ? getPathFromNode(Array.from(nextSelection)[0], nodeMap, parentMap) : ''
    });

    const expanded = new Set(expandedNodeIds);
    leafIds.forEach((leaf) => collectAncestors(leaf, parentMap).forEach((ancestor) => expanded.add(ancestor)));
    setExpandedNodeIds(Array.from(expanded));
  };

  const handleRemoveProduct = (productId: string) => {
    const remaining = activeObjective.selectedProductIds.filter((id) => id !== productId);
    updateObjectiveState(activeTab, {
      selectedProductIds: remaining,
      indicationPath: remaining.length > 0 ? getPathFromNode(remaining[0], nodeMap, parentMap) : ''
    });
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const set = new Set(prev);
      if (set.has(nodeId)) {
        set.delete(nodeId);
      } else {
        set.add(nodeId);
      }
      return Array.from(set);
    });
  };

  const updateMetricWeight = (level: AudienceLevel, metricId: string, weight: number) => {
    const metrics = activeObjective.metricsByLevel[level] ?? [];
    const updatedMetrics = metrics.map((metric) =>
      metric.id === metricId ? { ...metric, weight: clamp(weight, 0, MAX_WEIGHT) } : metric
    );

    updateObjectiveState(activeTab, {
      metricsByLevel: {
        ...activeObjective.metricsByLevel,
        [level]: updatedMetrics
      }
    });
  };

  const toggleMetricVisualize = (level: AudienceLevel, metricId: string) => {
    const metrics = activeObjective.metricsByLevel[level] ?? [];
    const updatedMetrics = metrics.map((metric) =>
      metric.id === metricId ? { ...metric, visualize: !metric.visualize } : metric
    );

    updateObjectiveState(activeTab, {
      metricsByLevel: {
        ...activeObjective.metricsByLevel,
        [level]: updatedMetrics
      }
    });
  };


  const updateSectionMetric = (
    level: AudienceLevel,
    sectionId: string,
    metricId: string,
    weight?: number,
    visualize?: boolean
  ) => {
    const sectionState =
      sectionId === competitiveSection.id
        ? activeObjective.competitiveSections
        : activeObjective.patientSections;
    const metrics = sectionState[sectionId]?.[level] ?? [];
    const updatedMetrics = metrics.map((metric) => {
      if (metric.id !== metricId) return metric;
      return {
        ...metric,
        weight: weight !== undefined ? clamp(weight, 0, MAX_WEIGHT) : metric.weight,
        visualize: visualize !== undefined ? visualize : metric.visualize
      };
    });

      const updatedSectionState = {
        ...sectionState[sectionId],
        [level]: updatedMetrics
      };

      if (sectionId === competitiveSection.id) {
        updateObjectiveState(activeTab, {
          competitiveSections: {
            ...activeObjective.competitiveSections,
            [sectionId]: updatedSectionState
          }
        });
      } else {
        updateObjectiveState(activeTab, {
          patientSections: {
            ...activeObjective.patientSections,
            [sectionId]: updatedSectionState
          }
        });
      }
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

  const renderProductNode = (node: ProductNode, level = 0): React.ReactNode => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.includes(node.id);
    const leafIds = collectLeafIds(node);
    const selectedCount = leafIds.filter((leafId) => activeObjective.selectedProductIds.includes(leafId)).length;
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
                toggleNodeExpansion(node.id);
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
              handleSelectProduct(node, isChecked);
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
                toggleNodeExpansion(node.id);
              } else {
                handleSelectProduct(node, isChecked);
              }
            }}
          >
            {node.label}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderProductNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  const renderSection = (
    section: BasketSectionDefinition,
    sectionState: Record<AudienceLevel, Array<{ id: string; label: string; weight: number; visualize: boolean }>>,
    sectionId: string,
    activeLevel: AudienceLevel,
    onLevelChange: (level: AudienceLevel) => void,
    onUpdate: (level: AudienceLevel, sectionId: string, metricId: string, update: Partial<{ weight: number; visualize: boolean }>) => void
  ) => {
    const availableLevels = section.tabs ?? DEFAULT_AUDIENCE_TABS;
    const metricsForLevel = sectionState[activeLevel] ?? [];

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
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{section.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Basket weight: {section.basketWeight}
                {section.products && section.products.length > 0 && (
                  <span style={{ marginLeft: '12px' }}>Products: {section.products.join(', ')}</span>
                )}
              </div>
            </div>
            {renderTabs(availableLevels, activeLevel, onLevelChange, (level) => (sectionState[level] ?? []).length > 0)}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(148, 163, 184, 0.08)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>Markets</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Scoring weight</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Visualize</th>
                </tr>
              </thead>
              <tbody>
                {metricsForLevel.map((metric) => (
                  <tr key={`${activeLevel}-${metric.id}`}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#e2e8f0' }}>{metric.label}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          min={0}
                          max={MAX_WEIGHT}
                          value={metric.weight}
                          onChange={(e) =>
                            onUpdate(activeLevel, sectionId, metric.id, {
                              weight: clamp(parseInt(e.target.value, 10) || 0, 0, MAX_WEIGHT)
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
                          onUpdate(activeLevel, sectionId, metric.id, {
                            visualize: !metric.visualize
                          })
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
                {metricsForLevel.length === 0 && (
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <Dialog.Title style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                {projectName}: {availableTabs.find((tab) => tab.id === activeTab)?.label ?? 'Objective'}
              </Dialog.Title>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                Configure product selections and adjust metric weighting across HCP, FSA, and Regional views.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleAddObjective}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: 'rgba(56, 189, 248, 0.18)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.28)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.18)')}
              >
                <Plus size={14} /> New Objective
              </button>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '3px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(148, 163, 184, 0.12)'
                }}
              >
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      margin: '0 2px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: activeTab === tab.id ? '#0f172a' : '#94a3b8',
                      backgroundColor: activeTab === tab.id ? '#38bdf8' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (isDraft) {
                    handleCloseDraft();
                  } else {
                    setActiveModal(null);
                  }
                }}
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
          </div>
          {isDraft && (
            <div
              style={{
                marginBottom: '24px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#e0f2fe',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>Draft objective – add basket details, products, and metrics. Close to discard.</span>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#38bdf8',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Exit
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: 0.42, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>Portfolio Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Basket Name</label>
                    <input
                      value={activeObjective.basketName}
                      onChange={(e) =>
                        updateObjectiveState(activeTab, {
                          basketName: e.target.value
                        })
                      }
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
                      value={activeObjective.basketWeight}
                      onChange={(e) =>
                        updateObjectiveState(activeTab, {
                          basketWeight: Number.isNaN(Number(e.target.value)) ? activeObjective.basketWeight : Number(e.target.value)
                        })
                      }
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
                    value={VALUE_ENGINE_CONFIG.therapeuticArea}
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
                    {activeObjective.selectedProductIds.map((id) => {
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
                              cursor: activeObjective.selectedProductIds.length > 1 ? 'pointer' : 'not-allowed'
                            }}
                            disabled={activeObjective.selectedProductIds.length <= 1}
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
                      value={activeObjective.indicationPath}
                      onChange={(e) =>
                        updateObjectiveState(activeTab, {
                          indicationPath: e.target.value
                        })
                      }
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
                      value={activeObjective.specialties}
                      onChange={(e) =>
                        updateObjectiveState(activeTab, {
                          specialties: e.target.value
                        })
                      }
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
                  {renderTabs(DEFAULT_AUDIENCE_TABS, activeMetricLevel, setActiveMetricLevel, () => true)}
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
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>Metric Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Scoring Weight</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Visualize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentMetrics.length > 0 ? currentMetrics : []).map((metric) => (
                        <tr key={`${activeMetricLevel}-${metric.id}`}>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', fontWeight: 500 }}>
                            {metric.id.replace(/_/g, ' ')}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="number"
                                min={0}
                                max={MAX_WEIGHT}
                                value={metric.weight}
                                onChange={(e) =>
                                  updateMetricWeight(
                                    activeMetricLevel,
                                    metric.id,
                                    clamp(parseInt(e.target.value, 10) || 0, 0, MAX_WEIGHT)
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

              {renderSection(
                competitiveSection,
                enrichMetricsWithLabels(competitiveSection, objectiveCompetitive),
                competitiveSection.id,
                competitiveLevel,
                setCompetitiveLevel,
                (level, sectionId, metricId, update) =>
                  updateSectionMetric(level, sectionId, metricId, update.weight, update.visualize)
              )}

              {renderSection(
                patientSection,
                enrichMetricsWithLabels(patientSection, objectivePatient),
                patientSection.id,
                patientLevel,
                setPatientLevel,
                (level, sectionId, metricId, update) =>
                  updateSectionMetric(level, sectionId, metricId, update.weight, update.visualize)
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '20px' }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'transparent',
                color: '#e2e8f0',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#38bdf8',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Configuration
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
