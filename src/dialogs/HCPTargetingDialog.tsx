import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';

interface HCPTargetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HCPTargetingDialog: React.FC<HCPTargetingDialogProps> = ({ isOpen, onClose }) => {
  const [useEstablished, setUseEstablished] = useState(true);
  const [currentValue, setCurrentValue] = useState(70);
  const [potential, setPotential] = useState(30);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  
  const competitiveStrategies = [
    { id: 1, label: '20% importance on 2L Therapy HER+ Overall Market, XPO TRx', checked: true },
    { id: 2, label: '50% importance on 2L Therapy HER+ submarket 1, XPO TRx', checked: true },
    { id: 3, label: '30% importance on 2L Therapy HER+ submarket 2, XPO TRx', checked: true },
    { id: 4, label: '10% importance on competitive brand Vectoral, XPO NBRx', checked: true }
  ];

  const patientMix = [
    { label: '20% 1L Therapy HER+ Market, XPO TRx', checked: true },
    { label: '80% Payer mix: Medicaid, Medicare', checked: true }
  ];

  if (!isOpen) return null;

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = `${(currentValue / 100) * circumference} ${circumference}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        width: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChevronLeft 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
              onClick={onClose}
            />
            <h2 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Value Engine: HCP Targeting
            </h2>
            <span style={{
              padding: '4px 12px',
              backgroundColor: 'var(--accent-yellow)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '6px'
            }}>
              Missing info
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Check 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
            />
            <X 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Circular Chart Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="var(--border-primary)"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="var(--accent-blue)"
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.3s' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {currentValue}/{potential}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Current Value /<br />Potential
                </div>
              </div>
            </div>
          </div>

          {/* PowerScore Setup */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              PowerScore Setup: HCP Value definition
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              Set the weight of historic performance (current value) and potential, factor in competitive market dynamics and patient mix, and generate a PowerScore to guide your targeting.
            </p>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={useEstablished}
                onChange={(e) => setUseEstablished(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Using Established Product Default
            </label>
          </div>

          {/* Advanced Edit Section */}
          {showAdvancedEdit && (
            <div style={{ 
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Advanced Configuration
              </h4>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Current Value Weight: {currentValue}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentValue}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCurrentValue(val);
                    setPotential(100 - val);
                  }}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--border-primary)',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Potential Weight: {potential}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={potential}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPotential(val);
                    setCurrentValue(100 - val);
                  }}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--border-primary)',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
              </div>
              
              <div style={{ 
                padding: '12px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Total Weight: {currentValue + potential}%
                  {(currentValue + potential) !== 100 && (
                    <span style={{ color: 'var(--accent-yellow)', marginLeft: '8px' }}>
                      (Should equal 100%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Three Column Layout */}
          <div style={{ 
            display: showAdvancedEdit ? 'none' : 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Current Value */}
            <div>
              <h4 style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                Current Value: {currentValue}%
              </h4>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                Current value of an HCP based on historical writing of Odaiazol
              </p>
              <div style={{ marginTop: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--accent-green)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    90% Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--accent-green)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    10% OncoThera Copay Card PSP Claims
                  </span>
                </div>
              </div>
            </div>

            {/* Potential */}
            <div>
              <h4 style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                Potential: {potential}%
              </h4>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                Potential based on HCPs competitive writing and patient mix
              </p>
              
              <div style={{ marginTop: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h5 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    Competitive Strategy: 80%
                  </h5>
                  {competitiveStrategies.map((strategy) => (
                    <div key={strategy.id} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px',
                      marginBottom: '6px'
                    }}>
                      <Check style={{ 
                        width: '14px', 
                        height: '14px', 
                        color: 'var(--accent-green)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {strategy.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h5 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    Patient Mix: 20%
                  </h5>
                  {patientMix.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px',
                      marginBottom: '6px'
                    }}>
                      <Check style={{ 
                        width: '14px', 
                        height: '14px', 
                        color: 'var(--accent-green)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty column for spacing */}
            <div></div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
            <button
              onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
              style={{
                padding: '10px 20px',
                backgroundColor: showAdvancedEdit ? 'var(--accent-blue)' : 'transparent',
                color: showAdvancedEdit ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {showAdvancedEdit ? 'Basic View' : 'Advanced Edit'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};