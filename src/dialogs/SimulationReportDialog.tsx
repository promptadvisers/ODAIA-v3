import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const SimulationReportDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'simulation-report';

  const chartData = [
    { segment: '1', A: 15, B: 10, C: 8, D: 12 },
    { segment: '2', A: 18, B: 14, C: 10, D: 15 },
    { segment: '3', A: 25, B: 20, C: 16, D: 22 },
    { segment: '4', A: 30, B: 22, C: 18, D: 25 },
    { segment: '5', A: 28, B: 18, C: 14, D: 20 },
    { segment: '6', A: 40, B: 35, C: 30, D: 38 },
    { segment: '7', A: 22, B: 18, C: 15, D: 20 },
    { segment: '8', A: 18, B: 15, C: 12, D: 16 },
    { segment: '9', A: 12, B: 10, C: 8, D: 11 },
    { segment: '10', A: 8, B: 6, C: 5, D: 7 }
  ];

  const handleApprove = () => {
    // Handle approval - this selects the winning configuration
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
          maxWidth: '1000px',
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
                Value Engine: HCP Targeting Report Option 1
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

          {/* PowerScore Chart */}
          <div style={{
            marginBottom: '32px',
            padding: '24px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '20px',
              letterSpacing: '-0.01em'
            }}>
              PowerScore by Segment - Comparison
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis
                  dataKey="segment"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  label={{ value: 'Segment', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  label={{ value: 'PowerScore', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-modal)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                  iconType="circle"
                />
                <Bar dataKey="A" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Scenario A" />
                <Bar dataKey="B" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Scenario B" />
                <Bar dataKey="C" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Scenario C" />
                <Bar dataKey="D" fill="#10b981" radius={[4, 4, 0, 0]} name="Scenario D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Current Value */}
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Current Value: 70%
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Current value of an HCP based on historical writing of Odaiazol
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    90% Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx Volume
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    10% OncoThera Copay Card PSP Claims
                  </span>
                </div>
              </div>
            </div>

            {/* Potential */}
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Potential: 30%
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Potential based on HCPs competitive writing and patient mix.
              </p>
            </div>

            {/* Competitive Strategy */}
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Competitive Strategy: 80%
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    20% importance on 2L Therapy HER+ Overall Market, XPO TRx
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    50% importance on 2L Therapy HER+ submarket 1, XPO TRx
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    30% importance on 2L Therapy HER+ submarket 2, XPO TRx
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    10% importance on competitive brand PixelTron, XPO NBRx
                  </span>
                </div>
              </div>
            </div>

            {/* Patient Mix */}
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Patient Mix: 20%
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    20% 1L Therapy HER+ Market, XPO TRx
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px'
                }}>
                  <Check size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    80% Payer mix, Medicaid, Medicare
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
