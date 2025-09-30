import React, { useState } from 'react';
import { X, Calendar, Users, Activity } from 'lucide-react';

interface CallPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallPlanDialog: React.FC<CallPlanDialogProps> = ({ isOpen, onClose }) => {
  const [hcpPerWeek, setHcpPerWeek] = useState('40');
  const [signals, setSignals] = useState('12');
  const [frequency, setFrequency] = useState('weekly');

  if (!isOpen) return null;

  const handleSave = () => {
    // Save logic here
    onClose();
  };

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
          maxWidth: '600px',
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
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Curation Engine: Call Plan
          </h2>
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
        <div style={{ padding: '24px' }}>
          {/* HCP Target Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                HCP Targeting
              </h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  HCPs per Week
                </label>
                <input
                  type="number"
                  value={hcpPerWeek}
                  onChange={(e) => setHcpPerWeek(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Reach Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Signals Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Activity style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Signal Configuration
              </h3>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Number of Signals
              </label>
              <input
                type="number"
                value={signals}
                onChange={(e) => setSignals(e.target.value)}
                style={{
                  width: '200px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Active Signal Types
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['New Patient Starts', 'Treatment Changes', 'Referral Patterns', 'Conference Attendance', 
                  'Publication Activity', 'Clinical Trial Participation'].map((signal) => (
                  <div
                    key={signal}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--accent-blue)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--accent-blue)',
                      cursor: 'pointer',
                      transition: 'all 200ms'
                    }}
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Schedule Preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Schedule Preview
              </h3>
            </div>
            
            <div style={{
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Weekly Target
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {hcpPerWeek}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    HCPs
                  </p>
                </div>
                
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Monthly Volume
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {parseInt(hcpPerWeek) * 4}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Interactions
                  </p>
                </div>
                
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Signal Coverage
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {signals}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Active Signals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
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
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
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
            Save Call Plan
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