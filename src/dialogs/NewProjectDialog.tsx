import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Metric {
  name: string;
  weight: number;
  visualize: boolean;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ isOpen, onClose }) => {
  const [portfolioExpanded, setPortfolioExpanded] = useState(true);
  const [competitiveExpanded, setCompetitiveExpanded] = useState(false);
  const [precursorExpanded, setPrecursorExpanded] = useState(false);
  
  const [basketName, setBasketName] = useState('Target Product Nucala');
  const [basketWeight, setBasketWeight] = useState('7');
  
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'IQVIA TRx Share Monthly', weight: 50, visualize: true },
    { name: 'IQVIA TRx Share Monthly', weight: 50, visualize: true },
    { name: 'IQVIA TRx Share Monthly', weight: 50, visualize: true },
    { name: 'IQVIA TRx Share Monthly', weight: 50, visualize: true },
    { name: 'IQVIA TRx Share Monthly', weight: 50, visualize: true }
  ]);

  const [selectedOptions, setSelectedOptions] = useState({
    SEA: true,
    EGPA: true,
    NP: true
  });

  if (!isOpen) return null;

  const handleMetricToggle = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics[index].visualize = !newMetrics[index].visualize;
    setMetrics(newMetrics);
  };

  const handleWeightChange = (index: number, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index].weight = parseInt(value) || 0;
    setMetrics(newMetrics);
  };

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
        width: '700px',
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
          <h2 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            New Project: Objective 1
          </h2>
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

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Portfolio Products Section */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setPortfolioExpanded(!portfolioExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Portfolio Products
              </h3>
              {portfolioExpanded ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              )}
            </button>
            
            {portfolioExpanded && (
              <div style={{ padding: '16px 0', display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    — Basket Name
                  </label>
                  <input
                    type="text"
                    value={basketName}
                    onChange={(e) => setBasketName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    — Basket Scoring Weight (0-10)
                  </label>
                  <input
                    type="text"
                    value={basketWeight}
                    onChange={(e) => setBasketWeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Basket Configurations */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Basket Configurations
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              Assign items to the configurations below to view available metrics
            </p>

            {/* Dropdowns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  — Therapeutic Area
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}>
                  <option>Select Therapeutic Areas</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  — Product
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}>
                  <option>Select Product</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  — Indications
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}>
                  <option>Select Indications (Optional)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              padding: '12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              {Object.entries(selectedOptions).map(([key, value]) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSelectedOptions({...selectedOptions, [key]: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {key}
                </label>
              ))}
            </div>

            {/* Metrics Table */}
            <div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '12px'
              }}>
                Assign scoring weight for each available metric
              </p>

              <div style={{
                backgroundColor: 'var(--bg-input)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 60px',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontWeight: '500'
                }}>
                  <div>Metric name</div>
                  <div>Scoring weight</div>
                  <div>Visualize</div>
                </div>

                {metrics.map((metric, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 60px',
                    padding: '10px 12px',
                    alignItems: 'center',
                    borderBottom: index < metrics.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                      {metric.name}
                    </div>
                    <input
                      type="text"
                      value={metric.weight + '%'}
                      onChange={(e) => handleWeightChange(index, e.target.value.replace('%', ''))}
                      style={{
                        width: '60px',
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={metric.visualize}
                      onChange={() => handleMetricToggle(index)}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive Opportunities */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setCompetitiveExpanded(!competitiveExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Competitive Opportunities
              </h3>
              {competitiveExpanded ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              )}
            </button>
          </div>

          {/* Precursor */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => setPrecursorExpanded(!precursorExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Precursor
              </h3>
              {precursorExpanded ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              )}
            </button>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
            <button
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
              Save objective
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};