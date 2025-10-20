import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

export const CurationCallPlanReviewDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'curation-call-plan-review';

  const handleApprove = () => {
    setActiveModal(null);
  };

  const handleEdit = () => {
    setActiveModal('curation-call-plan-edit');
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
                Curation: Call Plan
              </Dialog.Title>
              <span
                style={{
                  padding: '4px 12px',
                  background: 'rgba(148, 163, 184, 0.14)',
                  border: '1px solid rgba(148, 163, 184, 0.28)',
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
                padding: '4px 12px',
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '6px'
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

          {/* Two-Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '24px'
          }}>
            {/* Left Column - Suggestion Delivery */}
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Suggestion Delivery
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                Cadence and number suggestions to deliver
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  backgroundColor: 'transparent'
                }}>
                  <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}>
                    5-10 Suggestion per week
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  backgroundColor: 'transparent'
                }}>
                  <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}>
                    CEO Mindset, Reach and frequency used as reminders
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Suggestions */}
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Suggestions
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                Suggestions that are important to the brand
              </p>

              {/* Opportunity Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Opportunity
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      New writer identified for Vectoral
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Significant increase in Vectoral writing
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Section */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Risk
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Significant decrease in Odaiazol writing
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      New writer identified for Vectoral
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <Check size={18} color="var(--text-secondary)" strokeWidth={2} />
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Significant increase in Vectoral writing
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
            justifyContent: 'flex-end',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
