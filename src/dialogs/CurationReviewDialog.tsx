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
                Orchestration Engine
              </Dialog.Title>
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

          {/* Single Column Layout - Main Content */}
          <div style={{ marginBottom: '24px' }}>
              {/* Section 1: General Setup */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px'
                }}>
                  General Setup
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Associate HCP Targeting dropdown */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Associate HCP Targeting
                    </span>
                  </div>

                  {/* Odaiazol dropdown */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 8px 8px 42px',
                    backgroundColor: 'transparent'
                  }}>
                    <select
                      defaultValue="odaiazol"
                      style={{
                        padding: '6px 32px 6px 12px',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        outline: 'none',
                        minWidth: '200px'
                      }}
                    >
                      <option value="odaiazol">Odaiazol</option>
                      <option value="vectoral">Vectoral</option>
                    </select>
                  </div>

                  {/* Leverage Strategy checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5'
                    }}>
                      Leverage Strategy, Signals and, High quality, Positive PBM impact
                    </span>
                  </div>

                  {/* Proactive Engg delivery checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5'
                    }}>
                      Proactive Engg. delivery and, High Quality, Category & Brand Health
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Associated Odaiazol Selling Teams */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px'
                }}>
                  Associated Odaiazol Selling Teams
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      P1: US_SI (Odaiazol)
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      P2: US_SE (Odaiazol)
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      P3: US_XL (Odaiazol)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Campaign Settings */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Campaign Settings
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}>
                  Reach and frequency rules, and other engagement criteria
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Campaign 1
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Tactic Count 3
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Campaign Length: 1 Month
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={13} color="#ffffff" strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Adjust to changing marketing conditions
                    </span>
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
