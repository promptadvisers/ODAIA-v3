import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

export const ValueEngineReviewDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'value-engine-review';

  const handleApprove = () => {
    // Handle approval logic
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
          padding: '24px',
          width: '90vw',
          maxWidth: '900px',
          maxHeight: '85vh',
          overflow: 'auto',
          zIndex: 1001,
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                ←
              </button>
              <Dialog.Title style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Value Engine: HCP Targeting
              </Dialog.Title>
              <span style={{
                padding: '4px 12px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                fontSize: '12px',
                fontWeight: '500',
                borderRadius: '4px'
              }}>
                Review
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                ✓
              </button>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Circular Gauge */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '220px',
              height: '220px',
              margin: '0 auto 24px',
              position: 'relative'
            }}>
              {/* Outer circle */}
              <svg width="220" height="220" viewBox="0 0 220 220">
                {/* Background circle */}
                <circle
                  cx="110"
                  cy="110"
                  r="95"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.15)"
                  strokeWidth="24"
                />
                {/* Progress circle - 70% */}
                <circle
                  cx="110"
                  cy="110"
                  r="95"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="24"
                  strokeDasharray="418.88 596.97"
                  strokeDashoffset="0"
                  transform="rotate(-90 110 110)"
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
                  fontSize: '42px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  lineHeight: '1',
                  marginBottom: '8px'
                }}>
                  70/30
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.3'
                }}>
                  Current Value /<br />Potential
                </div>
              </div>
            </div>

            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              PowerScore Setup: HCP Value definition
            </h3>

            <select
              defaultValue="Odaiazol"
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '12px'
              }}
            >
              <option value="Odaiazol">Odaiazol</option>
            </select>

            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 8px',
              lineHeight: '1.5'
            }}>
              Set the weight of historic performance (current value) and potential, factor in competitive market dynamics and patient mix, and generate a PowerScore to guide your targeting.
            </p>

            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <Check size={14} style={{ color: '#10b981' }} />
              Using Established Product Default
            </p>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Current Value */}
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Current Value: 70%
              </h4>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Current value of an HCP based on historical writing of Odaiazol
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    90% Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx Volume
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    10% OncoThera Copay Card PSP Claims
                  </span>
                </div>
              </div>
            </div>

            {/* Potential */}
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Potential: 30%
              </h4>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                Potential based on HCPs competitive writing and patient mix.
              </p>

              {/* Competitive Potential */}
              <div style={{ marginBottom: '24px' }}>
                <h5 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Competitive Potential: 80%
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      80% importance on 2L Therapy HER+ Overall Market,  XPO TRx
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      20% importance on competitive brand PixelTron, XPO NBRx
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Potential */}
              <div>
                <h5 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Patient Potential: 20%
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      20% PSP Claims
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
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
            gap: '12px',
            justifyContent: 'flex-start',
            paddingTop: '20px',
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
