import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore, DEFAULT_VALUE_ENGINE_MODAL_TITLE } from '../store/appStore';

const OBJECTIVE_OPTIONS = ['Odaiazol Objective', 'Vectoral Objective'];

interface ObjectiveDataset {
  weightLabel: string;
  portfolioPercent: number;
  potentialPercent: number;
  competitivePercent: number;
  portfolioDescription: string;
  portfolioBullets: string[];
  competitiveBullets: string[];
  patientBullets: string[];
}

const ODAIAZOL_DATASET: ObjectiveDataset = {
  weightLabel: '70/30',
  portfolioPercent: 70,
  potentialPercent: 30,
  competitivePercent: 80,
  portfolioDescription: 'Portfolio performance of Odaiazol based on historic TRx and PSP influence.',
  portfolioBullets: [
    '90% Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx Volume',
    'OncoThera Copay Card PSP Claims'
  ],
  competitiveBullets: [
    '20% emphasis on 2L Therapy HER+ Overall Market, XPO TRx',
    '50% emphasis on 2L Therapy HER+ submarket 1, XPO TRx',
    '30% emphasis on 2L Therapy HER+ submarket 2, XPO TRx',
    '10% emphasis on competitive brand Vectoral, XPO NBRx'
  ],
  patientBullets: ['20% PSP Claims', '80% Payer mix, Medicaid, Medicare']
};

const VECTORAL_DATASET: ObjectiveDataset = {
  weightLabel: '60/40',
  portfolioPercent: 60,
  potentialPercent: 40,
  competitivePercent: 65,
  portfolioDescription: 'Portfolio performance of Vectoral capturing emerging prescriber shifts.',
  portfolioBullets: [
    '75% Vectoral, Respiratory Specialist Share, XPO TRx Volume',
    '15% Vectoral PSP Conversion Rate',
    '10% Vectoral Sample to TRx Ratio'
  ],
  competitiveBullets: [
    '30% emphasis on 1L Competitive Benchmark Set, NBRx',
    '25% emphasis on 2L Competitive Overlap, TRx',
    '15% emphasis on Market Basket Uptake, Claims',
    '10% emphasis on Adjacent Class Launch, TRx'
  ],
  patientBullets: ['25% PSP Claims', '55% Payer mix, Commercial Plans', '20% Payer mix, Medicaid']
};

const DATASET_BY_OBJECTIVE: Record<string, ObjectiveDataset> = {
  [OBJECTIVE_OPTIONS[0]]: ODAIAZOL_DATASET,
  [OBJECTIVE_OPTIONS[1]]: VECTORAL_DATASET
};

export const ValueEngineReviewDialog: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    pspMetricAdded,
    setSetupApproval,
    setSetupReady,
    setupApprovals,
    simulations,
    valueEngineModalTitle,
    setValueEngineModalTitle
  } = useAppStore();
  const isOpen = activeModal === 'value-engine-review';
  const [selectedObjective, setSelectedObjective] = useState<string>(OBJECTIVE_OPTIONS[0]);
  const dataset = useMemo(() => DATASET_BY_OBJECTIVE[selectedObjective] ?? ODAIAZOL_DATASET, [selectedObjective]);

  const handleApprove = () => {
    setSetupApproval('valueEngine', true);

    const pendingSimulation = simulations.some((simulation) => !simulation.approved);
    const pendingSections = Object.entries(setupApprovals).some(([key, approved]) => {
      if (key === 'valueEngine') {
        return false;
      }
      return !approved;
    });

    if (!pendingSimulation && !pendingSections) {
      setSetupReady(true);
    }

    setActiveModal(null);
  };

  const handleEdit = () => {
    setActiveModal('value-engine-edit');
  };

  const renderBulletList = (items: string[], emphasizePSP?: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((bullet) => (
        <div
          key={bullet}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            animation: emphasizePSP ? 'slideIn 0.3s ease-out' : 'none'
          }}
        >
          <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {bullet}
          </span>
        </div>
      ))}
    </div>
  );

  const handleClose = () => {
    setValueEngineModalTitle(DEFAULT_VALUE_ENGINE_MODAL_TITLE);
    setActiveModal(null);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }} />
        <Dialog.Content style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          padding: '28px 32px',
          width: '90vw',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: '1'
                }}
              >
                ←
              </button>
              <Dialog.Title style={{
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
              {valueEngineModalTitle}
              </Dialog.Title>
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(148, 163, 184, 0.16)',
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#e2e8f0'
                }}
              >
                P3: US XL
              </span>
              <span style={{
                padding: '4px 10px',
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '6px'
              }}>
                Review
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '18px',
                  lineHeight: '1'
                }}
              >
                ✓
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Circular Gauge */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '240px',
              height: '240px',
              margin: '0 auto 20px',
              position: 'relative'
            }}>
              {/* Outer circle */}
              <svg width="240" height="240" viewBox="0 0 240 240">
                {/* Background circle - Dark, prominent full ring */}
                <circle
                  cx="120"
                  cy="120"
                  r="88"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.28)"
                  strokeWidth="26"
                />
                {/* Progress circle - Bright blue 70% arc */}
                <circle
                  cx="120"
                  cy="120"
                  r="88"
                  fill="none"
                  stroke="#5b9ff8"
                  strokeWidth="26"
                  strokeDasharray="388 553"
                  strokeDashoffset="0"
                  transform="rotate(-90 120 120)"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  lineHeight: '1',
                  marginBottom: '6px'
                }}>
                  {dataset.weightLabel}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  Current Value /<br />Potential
                </div>
              </div>
            </div>

            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '10px'
            }}>
              PowerScore Setup: HCP Value definition
            </h3>

            <select
              value={selectedObjective}
              onChange={(event) => setSelectedObjective(event.target.value)}
              style={{
                padding: '7px 14px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '14px'
              }}
            >
              {OBJECTIVE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              margin: '0 auto 10px',
              lineHeight: '1.6'
            }}>
              Set the weight of historic performance (current value) and potential, factor in competitive market dynamics and patient mix, and generate a PowerScore to guide your targeting.
            </p>

            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}>
              <Check size={13} style={{ color: '#10b981' }} />
              Using Established Product Default
            </p>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '28px',
            marginBottom: '28px'
          }}>
            {/* Current Value */}
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}>
                Portfolio Products: {dataset.portfolioPercent}%
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '18px',
                lineHeight: '1.6'
              }}>
                {dataset.portfolioDescription}
              </p>
              {renderBulletList(dataset.portfolioBullets, selectedObjective === 'Vectoral Objective' || pspMetricAdded)}
              <style>{`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>

            {/* Potential */}
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}>
                Competitive Potential: {dataset.competitivePercent}%
              </div>
              {renderBulletList(dataset.competitiveBullets)}

              {/* Patient Potential */}
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  Patient Potential: {dataset.potentialPercent}%
                </div>
                {renderBulletList(dataset.patientBullets)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-start',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <Button variant="primary" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="secondary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
