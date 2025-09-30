import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';

interface SetupDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardType?: 'hcp-targeting' | 'call-plan';
}

export const SetupDetailDialog: React.FC<SetupDetailDialogProps> = ({ 
  isOpen, 
  onClose,
  cardType = 'call-plan'
}) => {
  const [suggestions] = useState<Record<string, boolean>>({
    weekly: true,
    ceoMindset: true,
    suggestion1: true,
    suggestion2: true,
    suggestion3: true,
    suggestion4: true,
    suggestion5: true,
    suggestion6: true
  });

  if (!isOpen) return null;

  const handleApprove = () => {
    // Handle approve action
    onClose();
  };

  const handleEdit = () => {
    // Handle edit action - could open the detailed edit dialog
    onClose();
  };

  const getTitle = () => {
    return cardType === 'hcp-targeting' ? 'HCP Targeting' : 'Call Plan';
  };

  const getSuggestionsContent = () => {
    if (cardType === 'hcp-targeting') {
      return {
        main: [
          { key: 'weekly', text: 'High-value HCP prioritization' },
          { key: 'ceoMindset', text: 'Established product weighting applied' }
        ],
        opportunity: [
          { key: 'suggestion1', text: 'Target Tier 1 oncologists' },
          { key: 'suggestion2', text: 'Focus on high-volume centers' },
          { key: 'suggestion3', text: 'Prioritize academic institutions' },
          { key: 'suggestion4', text: 'Expand to community practices' }
        ],
        risk: [
          { key: 'suggestion5', text: 'Monitor competitive activity' },
          { key: 'suggestion6', text: 'Track access changes' }
        ]
      };
    }
    return {
      main: [
        { key: 'weekly', text: '5-10 Suggestion per week' },
        { key: 'ceoMindset', text: 'CEO Mindset, Reach and frequency used as reminders' }
      ],
      opportunity: [
        { key: 'suggestion1', text: 'Suggestion 1' },
        { key: 'suggestion2', text: 'Suggestion 2' },
        { key: 'suggestion3', text: 'Suggestion 3' },
        { key: 'suggestion4', text: 'Suggestion 4' }
      ],
      risk: [
        { key: 'suggestion5', text: 'Suggestion 5' },
        { key: 'suggestion6', text: 'Suggestion 6' }
      ]
    };
  };

  const content = getSuggestionsContent();

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 200ms'
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          animation: 'slideIn 200ms'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 200ms'
              }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
            </button>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {getTitle()}
            </h2>
            <span style={{
              padding: '4px 8px',
              backgroundColor: 'var(--accent-orange)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}>
              Review
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 200ms'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{ display: 'flex', minHeight: '400px' }}>
          {/* Left Column - Suggestions */}
          <div style={{ 
            flex: 1, 
            padding: '24px',
            borderRight: '1px solid var(--border-subtle)'
          }}>
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
              marginBottom: '24px'
            }}>
              Description
            </p>
            
            {/* Main Suggestions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {content.main.map(item => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: suggestions[item.key] ? 'var(--accent-green)' : 'transparent',
                    border: `2px solid ${suggestions[item.key] ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 200ms'
                  }}>
                    {suggestions[item.key] && (
                      <Check style={{ width: '12px', height: '12px', color: 'white' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.5'
                  }}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Right Column - Types of Suggestions */}
          <div style={{ flex: 1, padding: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Types of Suggestions
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '24px'
            }}>
              Descriptions
            </p>
            
            {/* Opportunity Section */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Opportunity
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.opportunity.map(item => (
                  <label
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: suggestions[item.key] ? 'var(--accent-green)' : 'transparent',
                      border: `2px solid ${suggestions[item.key] ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 200ms'
                    }}>
                      {suggestions[item.key] && (
                        <Check style={{ width: '12px', height: '12px', color: 'white' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Risk Section */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Risk
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.risk.map(item => (
                  <label
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: suggestions[item.key] ? 'var(--accent-green)' : 'transparent',
                      border: `2px solid ${suggestions[item.key] ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 200ms'
                    }}>
                      {suggestions[item.key] && (
                        <Check style={{ width: '12px', height: '12px', color: 'white' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '12px'
        }}>
          <button
            onClick={handleApprove}
            style={{
              padding: '8px 20px',
              backgroundColor: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 200ms'
            }}
          >
            Approve
          </button>
          <button
            onClick={handleEdit}
            style={{
              padding: '8px 20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            Edit
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};