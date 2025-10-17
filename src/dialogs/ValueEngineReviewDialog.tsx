import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

export const ValueEngineReviewDialog: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    pspMetricAdded,
    setSetupApproval,
    setSetupReady,
    setupApprovals,
    simulations
  } = useAppStore();
  const isOpen = activeModal === 'value-engine-review';

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

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setActiveModal(null)}>
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
                onClick={() => setActiveModal(null)}
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
                Value Engine: HCP Targeting
              </Dialog.Title>
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
                onClick={() => setActiveModal(null)}
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
                onClick={() => setActiveModal(null)}
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
                  70/30
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
              defaultValue="Odaiazol"
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
              <option value="Odaiazol">Odaiazol</option>
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
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}>
                Current Value: 70%
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '18px',
                lineHeight: '1.6'
              }}>
                Current value of an HCP based on historical writing of Odaiazol
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {pspMetricAdded ? '80%' : '90%'} Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx Volume
                  </span>
                </div>
                {pspMetricAdded && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      10% OncoThera Copay Card PSP Claims
                    </span>
                  </div>
                )}
              </div>
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
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}>
                Potential: 30%
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '18px',
                lineHeight: '1.6'
              }}>
                Potential based on HCPs competitive writing and patient mix.
              </p>

              {/* Competitive Strategy */}
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  Competitive Strategy: 80%
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      20% importance on 2L Therapy HER+ Overall Market, XPO TRx
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      50% importance on 2L Therapy HER+ submarket 1, XPO TRx
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      30% importance on 2L Therapy HER+ submarket 2, XPO TRx
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      10% importance on competitive brand PixelTron, XPO NBRx
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Potential */}
              <div>
                <h5 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  Patient Potential: 20%
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      20% PSP Claims
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Check size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      80% Payer mix, Medicaid, Medicare
                    </span>
                  </div>
                </div>
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
