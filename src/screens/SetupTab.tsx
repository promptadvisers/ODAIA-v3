import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

interface SetupTabProps {
  onNavigateToReport?: () => void;
}

export const SetupTab: React.FC<SetupTabProps> = ({ onNavigateToReport }) => {
  const { hasUploadedFiles, selectedWorkflow, setActiveModal } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  // Simulate loading when entering setup tab
  useEffect(() => {
    if (hasUploadedFiles) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setSetupComplete(true);
      }, 3000); // 3 second loading simulation
      return () => clearTimeout(timer);
    }
  }, []); // Run once on mount

  if (!hasUploadedFiles) {
    return (
      <div style={{
        padding: '60px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        margin: '20px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          No configuration available
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          Please upload brand strategy documents first in the Brand tab
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        {/* Loading skeletons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            height: '24px',
            width: '200px',
            backgroundColor: 'var(--border-primary)',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              padding: '20px'
            }}>
              <div style={{
                height: '20px',
                width: '60%',
                backgroundColor: 'var(--border-primary)',
                borderRadius: '4px',
                marginBottom: '12px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div style={{
                height: '16px',
                width: '40%',
                backgroundColor: 'var(--border-primary)',
                borderRadius: '4px',
                marginBottom: '16px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div style={{
                height: '60px',
                width: '100%',
                backgroundColor: 'var(--border-primary)',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Setup Banner */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            Setup
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Approve setup to launch project.
          </p>
        </div>
        <Button
          disabled={!setupComplete}
          onClick={onNavigateToReport}
          style={{
            opacity: setupComplete ? 1 : 0.5,
            cursor: setupComplete ? 'pointer' : 'not-allowed',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '6px',
            backgroundColor: setupComplete ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: setupComplete ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            transition: 'all 0.2s ease',
            boxShadow: setupComplete ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Run Simulation
        </Button>
      </div>

      {/* Configuration Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Value Engine Card */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <CardTitle>Value Engine: HCP Targeting</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '4px'
                  }}>
                    Odaiazol
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '4px'
                  }}>
                    Established Product
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '4px'
                  }}>
                    70/30 Value Weighting
                  </span>
                </div>
              </div>
              <Badge variant="warning">Review</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              This defines how we value HCPs for scoring.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={() => setActiveModal('value-engine-review')}
              >
                Review
              </Button>
              <Button
                variant="secondary"
                onClick={() => setActiveModal('value-engine-edit')}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Curation Engine Card (Only for Sales workflow) */}
        {selectedWorkflow === 'sales' && (
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <CardTitle>Curation Engine: Call Plan</CardTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      5-10 Suggestions per week
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      12 Signals
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      Reach & Frequency
                    </span>
                  </div>
                </div>
                <Badge variant="warning">Review</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Define what, how and how often you would like our suggestions delivered to your sales reps.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="primary"
                  onClick={() => setActiveModal('curation-review')}
                >
                  Review
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setActiveModal('curation-edit')}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
