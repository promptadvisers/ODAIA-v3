import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../Badge';

interface SimulationDetails {
  name: string;
  status: 'completed' | 'running' | 'pending';
  configuration: {
    establishedProduct: string;
    parameters: string[];
    metrics: Array<{
      name: string;
      weight: number;
    }>;
  };
  results?: {
    powerScore: string;
    reach: string;
    frequency: string;
    targetingEfficiency: string;
  };
}

interface ReviewSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation?: SimulationDetails;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ReviewSimulationModal: React.FC<ReviewSimulationModalProps> = ({
  isOpen,
  onClose,
  simulation,
  onApprove,
  onReject
}) => {
  console.log('ReviewSimulationModal render - isOpen:', isOpen, 'simulation:', simulation);
  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }
  console.log('Modal is open, rendering content');

  const defaultSimulation: SimulationDetails = {
    name: 'Value Engine: HCP Targeting Option 1',
    status: 'completed',
    configuration: {
      establishedProduct: 'Odaiazol - 70/30 Value Weighting',
      parameters: [
        'XPO TRx Weight: 0.5',
        'XPO NRx Weight: 0.2',
        'xpo_dollars Weight: 0.3'
      ],
      metrics: [
        { name: 'PowerScore (HCP Overall)', weight: 0.7 },
        { name: 'Segment Scores', weight: 0.3 },
        { name: 'Event Activity', weight: 0.4 }
      ]
    },
    results: {
      powerScore: '85%',
      reach: '72%',
      frequency: '4.2 calls/month',
      targetingEfficiency: '91%'
    }
  };

  const sim = simulation || defaultSimulation;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
      }}>
      <div style={{
        backgroundColor: '#1a1f2e',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#1a2332',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#ffffff',
              margin: 0,
              marginBottom: '4px'
            }}>
              Review Simulation Configuration
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: 0
            }}>
              {sim.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: '24px'
        }}>
          {/* Status */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              Simulation Status
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {sim.status === 'completed' ? (
                <CheckCircle size={20} style={{ color: '#10b981' }} />
              ) : (
                <AlertCircle size={20} style={{ color: '#f59e0b' }} />
              )}
              <Badge variant={sim.status === 'completed' ? 'success' : 'warning'}>
                {sim.status === 'completed' ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
          </div>

          {/* Configuration */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              Configuration Parameters
            </h3>
            <div style={{
              backgroundColor: '#0f1419',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Established Product
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#ffffff'
                }}>
                  {sim.configuration.establishedProduct}
                </span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Modified Parameters
                </span>
                {sim.configuration.parameters.map((param, index) => (
                  <div key={index} style={{
                    padding: '6px 10px',
                    backgroundColor: '#0a0d12',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    {param}
                  </div>
                ))}
              </div>

              <div>
                <span style={{
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Metric Weights
                </span>
                {sim.configuration.metrics.map((metric, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index < sim.configuration.metrics.length - 1 ? '1px solid #2a3441' : 'none'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      {metric.name}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#ffffff',
                      fontWeight: '500'
                    }}>
                      {(metric.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results (if completed) */}
          {sim.status === 'completed' && sim.results && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Simulation Results
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#0f1419',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    PowerScore
                  </span>
                  <span style={{
                    fontSize: '20px',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>
                    {sim.results.powerScore}
                  </span>
                </div>
                
                <div style={{
                  backgroundColor: '#0f1419',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Reach
                  </span>
                  <span style={{
                    fontSize: '20px',
                    color: '#3b82f6',
                    fontWeight: '600'
                  }}>
                    {sim.results.reach}
                  </span>
                </div>
                
                <div style={{
                  backgroundColor: '#0f1419',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Frequency
                  </span>
                  <span style={{
                    fontSize: '20px',
                    color: '#f59e0b',
                    fontWeight: '600'
                  }}>
                    {sim.results.frequency}
                  </span>
                </div>
                
                <div style={{
                  backgroundColor: '#0f1419',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Targeting Efficiency
                  </span>
                  <span style={{
                    fontSize: '20px',
                    color: '#8b5cf6',
                    fontWeight: '600'
                  }}>
                    {sim.results.targetingEfficiency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              if (onReject) onReject();
              onClose();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #2a3441',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Reject
          </button>
          <button
            onClick={() => {
              if (onApprove) onApprove();
              onClose();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Approve Configuration
          </button>
        </div>
      </div>
    </div>
  );
};