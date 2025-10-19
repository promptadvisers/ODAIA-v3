import React, { useMemo, useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle2, Circle, Database } from 'lucide-react';
import { Button } from '../components/Button';
import {
  useAppStore,
  MOCK_PRODUCTS,
  type Product,
  type SimulationScenario,
  mapObjectiveMetricsToSimulation
} from '../store/appStore';

interface AddSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConfigurationTemplate = 'copy' | 'fresh';

const START_FRESH_DEFAULTS = {
  valueEngine: {
    metrics: [
      { name: 'XPO TRx Volume', weight: 60, visualize: true },
      { name: 'XPO NBRx Volume', weight: 25, visualize: true },
      { name: 'Targeted Biomarker Share', weight: 15, visualize: false }
    ],
    basketWeight: '6'
  },
  curation: {
    suggestionsPerWeek: '4-6',
    signals: 9,
    strategy: 'Engagement Expansion',
    reachFrequency: '3 calls/month'
  }
};

const SectionHeader: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
    {description && (
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
        {description}
      </p>
    )}
  </div>
);

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px' }}>
    <span>{label}</span>
    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
  </div>
);

const RadioCard: React.FC<{
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  footnote?: string;
}> = ({ selected, onSelect, title, description, footnote }) => (
  <button
    onClick={onSelect}
    style={{
      borderRadius: '10px',
      padding: '16px',
      border: `1px solid ${selected ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
      background: selected ? 'rgba(37, 99, 235, 0.18)' : 'rgba(15, 23, 42, 0.65)',
      textAlign: 'left',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease, background-color 0.2s ease'
    }}
  >
    {selected ? (
      <CheckCircle2 size={18} color='var(--accent-blue)' style={{ marginTop: '2px' }} />
    ) : (
      <Circle size={18} color='var(--text-muted)' style={{ marginTop: '2px' }} />
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{description}</div>
      {footnote && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{footnote}</div>
      )}
    </div>
  </button>
);

const MetricRow: React.FC<{ name: string; weight: number; visualize: boolean }> = ({ name, weight, visualize }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  }}>
    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{name}</span>
    <span style={{ color: 'var(--text-primary)' }}>{weight}%</span>
    <span>{visualize ? 'Visualized' : 'Input only'}</span>
  </div>
);

export const AddSimulationModal: React.FC<AddSimulationModalProps> = ({ isOpen, onClose }) => {
  const { addSimulation, simulations, selectedWorkflow, projectName, objectives, activeObjectiveId } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [template, setTemplate] = useState<ConfigurationTemplate>('copy');
  const [simulationName, setSimulationName] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const simulationNumber = simulations.length + 1;
      setSimulationName(`Simulation ${simulationNumber}`);
      setSelectedProduct(MOCK_PRODUCTS[0] ?? null);
      setTemplate('copy');
      setAdvancedOpen(false);
    }
  }, [isOpen, simulations.length]);

  const canSubmit = Boolean(selectedProduct && simulationName.trim());

  const freshMetrics = useMemo(() => START_FRESH_DEFAULTS.valueEngine.metrics, []);
  const activeObjective = objectives[activeObjectiveId];

  const copySummary = useMemo(
    () => [
      { label: 'Objective', value: activeObjective?.basketName ?? '—' },
      { label: 'Project', value: projectName },
      { label: 'Indication Path', value: activeObjective?.indicationPath ?? '—' },
      { label: 'Basket Weight', value: activeObjective ? `${activeObjective.basketWeight}` : '—' }
    ],
    [activeObjective, projectName]
  );

  const freshSummary = useMemo(
    () => [
      { label: 'Product', value: selectedProduct?.name ?? 'Select a product' },
      { label: 'Therapeutic Area', value: selectedProduct?.therapeuticArea ?? '—' },
      { label: 'Indication', value: selectedProduct?.indication ?? '—' },
      { label: 'Basket Weight', value: START_FRESH_DEFAULTS.valueEngine.basketWeight }
    ],
    [selectedProduct]
  );

  const handleAddSimulation = () => {
    if (!selectedProduct || !simulationName.trim() || !activeObjective) return;

    const isCopy = template === 'copy';

    const newSimulation: Omit<SimulationScenario, 'id' | 'createdAt' | 'approved'> = {
      name: simulationName.trim(),
      product: selectedProduct,
      valueEngine: isCopy
        ? mapObjectiveMetricsToSimulation(activeObjective, projectName)
        : {
            objectiveId: activeObjectiveId,
            projectName,
            basketName: selectedProduct.name,
            basketWeight: Number(START_FRESH_DEFAULTS.valueEngine.basketWeight),
            therapeuticArea: selectedProduct.therapeuticArea,
            indication: selectedProduct.indication,
            metrics: freshMetrics.map((metric) => ({
              id: metric.name,
              name: metric.name,
              weight: metric.weight,
              visualize: metric.visualize
            }))
          },
      curationEngine:
        selectedWorkflow === 'sales'
          ? isCopy
            ? {
                suggestionsPerWeek: '5-10',
                signals: 12,
                strategy: 'Reach & Frequency',
                reachFrequency: '4-6 calls/month'
              }
            : { ...START_FRESH_DEFAULTS.curation }
          : undefined,
      status: 'configured'
    };

    addSimulation(newSimulation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100
      }}
    >
      <div
        style={{
          width: '94vw',
          maxWidth: '680px',
          maxHeight: '92vh',
          background: 'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(15, 23, 42, 0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Add Simulation Scenario
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Configure an additional scenario to compare during the next simulation run.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(148, 163, 184, 0.08)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              borderRadius: '999px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color='var(--text-secondary)' />
          </button>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
          <SectionHeader title='Simulation Name' description='Name your scenario to differentiate it in reports.' />
          <div style={{ marginBottom: '24px' }}>
            <input
              type='text'
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
              placeholder='Simulation name'
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'inline-block' }}>
              We’ll auto-increment the numbering if you keep the default naming convention.
            </span>
          </div>

          <SectionHeader title='Select Product' description='Choose the promoted product that anchors this scenario.' />
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.7)'
              }}
            >
              <select
                value={selectedProduct?.id ?? ''}
                onChange={(e) => {
                  const product = MOCK_PRODUCTS.find((p) => p.id === e.target.value);
                  setSelectedProduct(product ?? null);
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px 12px 0 0',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              >
                {MOCK_PRODUCTS.map((product) => (
                  <option key={product.id} value={product.id} style={{ color: '#000' }}>
                    {product.name} · {product.indication}
                  </option>
                ))}
              </select>

              {selectedProduct && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '18px',
                    padding: '16px'
                  }}
                >
                  <SummaryRow label='Therapeutic Area' value={selectedProduct.therapeuticArea} />
                  <SummaryRow label='Launch Status' value={selectedProduct.launchStatus} />
                  <SummaryRow label='Indication' value={selectedProduct.indication} />
                  <SummaryRow label='Workflow' value={selectedWorkflow === 'sales' ? 'Sales' : 'Marketing'} />
                </div>
              )}
            </div>
          </div>

          <SectionHeader title='Configuration Template' description='Decide whether to inherit the current configuration or build a new one from defaults.' />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <RadioCard
              selected={template === 'copy'}
              onSelect={() => setTemplate('copy')}
              title='Copy from Original Configuration'
              description='Clones all value engine weights, basket settings, and (for sales) curation configuration from your existing scenario.'
            />
            <RadioCard
              selected={template === 'fresh'}
              onSelect={() => setTemplate('fresh')}
              title='Start Fresh'
              description='Begins with oncology defaults commonly used for early exploration, letting you tailor the metrics afterwards.'
              footnote='Great when exploring alternate indications or preparing a brand-new launch plan.'
            />
          </div>

          <div
            style={{
              padding: '16px',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.55)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Summary</span>
              <button
                onClick={() => setAdvancedOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-blue)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                <Database size={14} />
                {advancedOpen ? 'Hide Details' : 'View Details'}
                {advancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
              {(template === 'copy' ? copySummary : freshSummary).map((item) => (
                <SummaryRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            {advancedOpen && template === 'fresh' && (
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Default Metrics
                </div>
                <div>
                  {freshMetrics.map((metric) => (
                    <MetricRow key={metric.name} {...metric} />
                  ))}
                </div>

                {selectedWorkflow === 'sales' && (
                  <div style={{ marginTop: '18px', display: 'grid', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Curation Defaults
                    </div>
                    <SummaryRow label='Suggestions/Week' value={START_FRESH_DEFAULTS.curation.suggestionsPerWeek} />
                    <SummaryRow label='Signals' value={`${START_FRESH_DEFAULTS.curation.signals}`} />
                    <SummaryRow label='Strategy' value={START_FRESH_DEFAULTS.curation.strategy} />
                    <SummaryRow label='Reach & Frequency' value={START_FRESH_DEFAULTS.curation.reachFrequency} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleAddSimulation} disabled={!canSubmit}>
            Add Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};
