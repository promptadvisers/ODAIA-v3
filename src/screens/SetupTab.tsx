import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { AddSimulationModal } from '../dialogs/AddSimulationModal';
import { OrchestrationWizard } from '../components/Setup/OrchestrationWizard';
import type { OrchestrationWizardState } from '../components/Setup/OrchestrationWizard';
import { useAppStore } from '../store/appStore';
import { useChatStore } from '../store/chatStore';

interface SetupTabProps {
  onNavigateToReport?: () => void;
}

export const SetupTab: React.FC<SetupTabProps> = ({ onNavigateToReport }) => {
  const {
    hasUploadedFiles,
    selectedWorkflow,
    setActiveModal,
    setValueEngineModalTitle,
    simulations,
    setupApprovals,
    setSetupApproval,
    approveAllSetup,
    setSimulationApproval,
    updateSimulation,
    removeSimulation,
    setSetupReady
  } = useAppStore();
  const { setSimulationTriggered } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [highlightedSimId] = useState<string | null>(null);
  const [simulationCount, setSimulationCount] = useState(3);
  const [showAddSimulationModal, setShowAddSimulationModal] = useState(false);
  const [editingSimulationId, setEditingSimulationId] = useState<string | null>(null);
  const [editingSimulationName, setEditingSimulationName] = useState('');
  const [isOrchestrationWizardOpen, setIsOrchestrationWizardOpen] = useState(false);
  const [orchestrationConfig, setOrchestrationConfig] = useState<OrchestrationWizardState | null>(null);

  const isOrchestrationEnabled = selectedWorkflow === 'marketing';
  const isCurationEnabled = selectedWorkflow === 'sales';

  const allSetupApproved =
    setupApprovals.valueEngine &&
    (!isOrchestrationEnabled || setupApprovals.orchestration) &&
    (!isCurationEnabled || setupApprovals.curation) &&
    simulations.every((simulation) => simulation.approved);

  useEffect(() => {
    setSetupReady(allSetupApproved);
  }, [allSetupApproved, setSetupReady]);

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

  // Handle running simulations
  const handleRunSimulations = () => {
    // Trigger simulations to start running
    setSimulationTriggered(true);

    // Delay navigation slightly to ensure state update propagates first
    setTimeout(() => {
      onNavigateToReport?.();
    }, 0);
  };

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            {allSetupApproved ? 'Good to go.' : 'Approve and run reports;'} {simulationCount} Variants on your setup will be performed
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => approveAllSetup(selectedWorkflow)}
            disabled={allSetupApproved}
          >
            Approve All
          </Button>
          <select
            value={simulationCount}
            onChange={(e) => setSimulationCount(parseInt(e.target.value))}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} Simulation{num > 1 ? 's' : ''}</option>
            ))}
          </select>
          <Button
            disabled={!setupComplete}
            onClick={handleRunSimulations}
          >
            Run
          </Button>
        </div>
      </div>

      {/* All Configuration Cards - Original + Dynamic Simulations in ONE grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
        {/* Value Engine Card */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <CardTitle>Value Engine: Segmentation</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '4px'
                  }}>
                    Odaiazol Objective
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
              <Badge variant={setupApprovals.valueEngine ? 'success' : 'warning'}>
                {setupApprovals.valueEngine ? 'Ready' : 'Review'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              This defines how we value Target Entities for scoring.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={() => {
                  setValueEngineModalTitle('Value Engine: Segmentation');
                  setActiveModal('value-engine-review');
                }}
              >
                Review
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setValueEngineModalTitle('Value Engine: Segmentation');
                  setActiveModal('value-engine-edit');
                }}
              >
                Edit
              </Button>
                <Button
                  variant={setupApprovals.valueEngine ? 'ghost' : 'secondary'}
                  onClick={() => setSetupApproval('valueEngine', true)}
                  disabled={setupApprovals.valueEngine}
                >
                  {setupApprovals.valueEngine ? 'Approved' : 'Approve'}
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orchestration Engine Card (Only for Marketing workflow) */}
        {selectedWorkflow === 'marketing' && (
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <CardTitle>Orchestration Engine</CardTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {orchestrationConfig?.objective ?? 'Odaiazol Objective'}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {`${orchestrationConfig?.personas.length ?? 5} Personas`}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {`${orchestrationConfig?.stages.length ?? 5} Stages`}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {`${orchestrationConfig?.tactics.length ?? 16} Tactics`}
                    </span>
                  </div>
                </div>
                <Badge variant={setupApprovals.orchestration ? 'success' : 'warning'}>
                  {setupApprovals.orchestration ? 'Ready' : 'Review'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Configure orchestration tactics, journey stages, and marketing cadence before launch.
              </p>
              <div style={{
                display: 'grid',
                gap: '16px',
                marginBottom: orchestrationConfig ? '24px' : '0',
                backgroundColor: orchestrationConfig ? 'rgba(15, 23, 42, 0.55)' : 'transparent',
                borderRadius: orchestrationConfig ? '8px' : '0',
                border: orchestrationConfig ? '1px solid var(--border-subtle)' : 'none',
                padding: orchestrationConfig ? '16px' : '0'
              }}>
                {orchestrationConfig && (
                  <>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Selected Personas</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {orchestrationConfig.personas.map((persona) => (
                          <span key={persona} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{persona}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Journey Stages</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {orchestrationConfig.stages.map((stage) => (
                          <span key={stage} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stage}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Selling Teams</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {orchestrationConfig.sellingTeams.map((team) => (
                          <span key={team} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{team}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="primary"
                  onClick={() => setActiveModal('curation-review')}
                >
                  Review
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsOrchestrationWizardOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant={setupApprovals.orchestration ? 'ghost' : 'secondary'}
                  onClick={() => setSetupApproval('orchestration', true)}
                  disabled={setupApprovals.orchestration}
                >
                  {setupApprovals.orchestration ? 'Approved' : 'Approve'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curation Engine: Call Plan Card (Only for Sales workflow) */}
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
                <Badge variant={setupApprovals.curation ? 'success' : 'warning'}>
                  {setupApprovals.curation ? 'Ready' : 'Review'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Define what, how and how often you would like our suggestions delivered to your sales reps.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="primary"
                  onClick={() => setActiveModal('curation-call-plan-review')}
                >
                  Review
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setActiveModal('curation-call-plan-edit')}
                >
                  Edit
                </Button>
                <Button
                  variant={setupApprovals.curation ? 'ghost' : 'secondary'}
                  onClick={() => setSetupApproval('curation', true)}
                  disabled={setupApprovals.curation}
                >
                  {setupApprovals.curation ? 'Approved' : 'Approve'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Simulation Cards */}
        {simulations.map((simulation) => (
          <Card
            key={simulation.id}
            style={{
              animation: highlightedSimId === simulation.id ? 'highlightPulse 1s ease-in-out' : 'none'
            }}
          >
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <CardTitle>{simulation.name}</CardTitle>
                    {!simulation.createdAt && (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '3px 10px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {simulation.product.name}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {simulation.product.therapeuticArea}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {simulation.product.launchStatus}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      {simulation.valueEngine.metrics.filter((m: any) => m.weight > 0).length} Active Metrics
                    </span>
                    {selectedWorkflow === 'sales' && simulation.curationEngine && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--border-primary)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '500',
                        borderRadius: '4px'
                      }}>
                        {simulation.curationEngine.suggestionsPerWeek} Suggestions/week
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={simulation.approved ? 'success' : 'warning'}>
                  {simulation.approved ? 'Ready' : 'Review'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Value Engine Section */}
              <div style={{ marginBottom: selectedWorkflow === 'sales' && simulation.curationEngine ? '24px' : '0' }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px'
                }}>
                  Value Engine Configuration
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Product</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {simulation.createdAt ? '—' : simulation.valueEngine.basketName}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Indication</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {simulation.valueEngine.indication}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Basket Weight</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {simulation.valueEngine.basketWeight}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Metrics</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {simulation.valueEngine.metrics.filter((m: any) => m.weight > 0).length} configured
                    </div>
                  </div>
                </div>
              </div>

              {/* Curation Engine Section (Sales only) */}
              {selectedWorkflow === 'sales' && simulation.curationEngine && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '8px'
                  }}>
                    Curation Engine Configuration
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Suggestions per Week</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {simulation.curationEngine.suggestionsPerWeek}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Signals</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {simulation.curationEngine.signals}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Strategy</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {simulation.curationEngine.strategy}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Reach & Frequency</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {simulation.curationEngine.reachFrequency}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                <Button
                  variant={simulation.approved ? 'ghost' : 'secondary'}
                  onClick={() => setSimulationApproval(simulation.id, true)}
                  disabled={simulation.approved}
                >
                  {simulation.approved ? 'Approved' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeSimulation(simulation.id)}
                >
                  Remove
                </Button>
                {editingSimulationId === simulation.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      value={editingSimulationName}
                      onChange={(e) => setEditingSimulationName(e.target.value)}
                      autoFocus
                      style={{
                        width: '220px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (editingSimulationName.trim()) {
                          updateSimulation(simulation.id, { name: editingSimulationName.trim() });
                        }
                        setEditingSimulationId(null);
                        setEditingSimulationName('');
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSimulationId(null);
                        setEditingSimulationName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingSimulationId(simulation.id);
                      setEditingSimulationName(simulation.name);
                    }}
                  >
                    Rename
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div
          style={{
            border: '1px dashed var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease, background-color 0.2s ease'
          }}
          onClick={() => setShowAddSimulationModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-blue)';
            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.4)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Add Simulation
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Create an additional scenario to compare in the run results.
            </span>
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--accent-blue)',
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600
            }}
          >
            +
          </div>
        </div>
      </div>

      <AddSimulationModal
        isOpen={showAddSimulationModal}
        onClose={() => setShowAddSimulationModal(false)}
      />
      <OrchestrationWizard
        isOpen={isOrchestrationWizardOpen}
        onClose={() => setIsOrchestrationWizardOpen(false)}
        onSave={(config) => setOrchestrationConfig(config)}
        initialState={orchestrationConfig}
      />


      <style>{`
        @keyframes highlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </div>
  );
};
