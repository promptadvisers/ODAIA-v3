import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

export const CurationReviewDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'curation-review';

  const handleApprove = () => {
    setActiveModal(null);
  };

  const handleEdit = () => {
    setActiveModal('curation-edit');
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

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '24px'
          }}>
            {/* Left Column - Suggestion Delivery */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Suggestion Delivery
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Cadence and number suggestions to deliver.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    5-10 Suggestion per week
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    CEO Mindset, Reach and frequency used as reminders
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Suggestions */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Suggestions
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Suggestions that are important to the brand.
              </p>

              {/* Opportunity Section */}
              <div style={{ marginBottom: '20px' }}>
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
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      New writer identified for Odaiazol
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Significant increase in Odaiazol writing
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
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Significant decrease in Odaiazol writing
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      New writer identified for PixelTron
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Significant increase in PixelTron writing
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
