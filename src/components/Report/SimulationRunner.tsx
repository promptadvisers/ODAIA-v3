import React, { useState, useEffect } from 'react';
import { SimulationCard } from './SimulationCard';
import { SimulationResults } from './SimulationResults';
import { EditConfigurationModal } from './EditConfigurationModal';
import { ReviewSimulationModal } from './ReviewSimulationModal';
import { useAppStore } from '../../store/appStore';
import { useChatStore } from '../../store/chatStore';

export interface Simulation {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed';
  progress: number;
  startTime?: number;
  config: {
    establishedProduct: string;
    labels?: string[];
    parameters: string[];
  };
  results?: {
    powerScoreData: Array<{
      segment: string;
      values: number[];
    }>;
    currentValue: string;
    potential: string;
    competitiveStrategy: string;
    patientMix: string;
  };
}

interface SimulationRunnerProps {
  simulations?: Simulation[];
  configuredScenarios?: any[];
}

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({ simulations: initialSimulations, configuredScenarios: _configuredScenarios }) => {
  const { productConfig, simulations: setupSimulations } = useAppStore();
  const { simulationTriggered, setSimulationTriggered } = useChatStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);

  // Convert configured scenarios from SetupTab into simulations
  const scenariosToSimulations = (scenarios: any[]): Simulation[] => {
    return scenarios.map((scenario, index) => ({
      id: scenario.id || `sim-${index + 1}`,
      name: scenario.name || `Simulation ${index + 1}`,
      status: 'pending' as const,
      progress: 0,
      config: {
        establishedProduct: scenario.product?.name || scenario.valueEngine?.product || 'Default Product',
        parameters: []
      }
    }));
  };

  // Use configured scenarios if provided, otherwise use setupSimulations, fallback to defaults
  const getInitialSimulations = (): Simulation[] => {
    // Always include the 2 original cards
    const originalSimulations: Simulation[] = [
      {
        id: 'value-engine-option-1',
        name: 'Value Engine: HCP Targeting Option 1',
        status: 'pending',
        progress: 0,
        config: {
          establishedProduct: productConfig.product || 'Odaiazol',
          labels: [
            'Established Product',
            '70/30 Value Weighting'
          ],
          parameters: []
        }
      },
      {
        id: 'value-engine-option-2',
        name: 'Value Engine: HCP Targeting Option 2',
        status: 'pending',
        progress: 0,
        config: {
          establishedProduct: productConfig.product || 'Odaiazol',
          labels: [
            'Established Product',
            '70/30 Value Weighting',
            'XPO TRx Weight to 0.2'
          ],
          parameters: []
        }
      }
    ];

    // Add any additional simulations from Setup tab
    const additionalSimulations = setupSimulations.length > 0
      ? scenariosToSimulations(setupSimulations)
      : [];

    // Combine original + additional
    return [...originalSimulations, ...additionalSimulations];
  };

  const [simulations, setSimulations] = useState<Simulation[]>(initialSimulations || getInitialSimulations());

  // Debug modal state
  useEffect(() => {
    console.log('showReviewModal changed to:', showReviewModal);
    console.log('selectedSimulation:', selectedSimulation);
  }, [showReviewModal, selectedSimulation]);

  // Check if simulation was triggered from chat
  useEffect(() => {
    if (simulationTriggered) {
      // Start ONLY the first simulation, leave others as pending
      const startTime = Date.now();
      console.log('[SimulationRunner] Simulation triggered! Starting first simulation at:', startTime);
      setSimulations(prev => {
        const updated = prev.map((sim, index) => {
          if (index === 0) {
            // Start the first simulation
            return {
              ...sim,
              status: 'running',
              progress: 0,
              startTime: startTime
            };
          } else {
            // Keep others as pending
            return {
              ...sim,
              status: 'pending',
              progress: 0,
              startTime: undefined
            };
          }
        });
        console.log('[SimulationRunner] Updated simulations:', updated);
        return updated;
      });

      // DON'T reset the trigger here - let it stay true while simulations run
      // It will be reset when all simulations complete (see effect below)
    }
  }, [simulationTriggered, setSimulationTriggered]);

  // Simulate progress for running simulations - runs for exactly 12 seconds
  useEffect(() => {
    const duration = 12000; // 12 seconds total
    const intervalTime = 100; // Update every 100ms for smooth animation

    console.log('[SimulationRunner] Setting up progress interval');

    const interval = setInterval(() => {
      setSimulations(prev => {
        let hasJustCompleted = false;

        // First pass: update progress for running simulations
        const updated = prev.map(sim => {
          if (sim.status === 'running' && sim.startTime) {
            // Calculate progress based on elapsed time since start
            const elapsed = Date.now() - sim.startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            console.log(`[SimulationRunner] ${sim.name}: elapsed=${elapsed}ms, progress=${newProgress.toFixed(2)}%`);

            // Complete simulation when progress reaches 100
            if (newProgress >= 100) {
              console.log(`[SimulationRunner] ${sim.name}: COMPLETED`);
              hasJustCompleted = true;
              return {
                ...sim,
                progress: 100,
                status: 'completed',
                results: generateMockResults(sim.id)
              };
            }

            return { ...sim, progress: newProgress };
          }
          return sim;
        });

        // Second pass: if a simulation just completed, start the next pending one
        if (hasJustCompleted) {
          const nextPendingIndex = updated.findIndex(s => s.status === 'pending');
          if (nextPendingIndex !== -1) {
            console.log(`[SimulationRunner] Starting next simulation: ${updated[nextPendingIndex].name}`);
            updated[nextPendingIndex] = {
              ...updated[nextPendingIndex],
              status: 'running',
              progress: 0,
              startTime: Date.now()
            };
          }
        }

        return updated;
      });
    }, intervalTime);

    return () => {
      console.log('[SimulationRunner] Cleaning up progress interval');
      clearInterval(interval);
    };
  }, []);

  const generateMockResults = (simId: string): Simulation['results'] => {
    const segments = ['A', 'B', 'C', 'D'];
    const powerScoreData = segments.map(segment => ({
      segment,
      values: Array.from({ length: 10 }, () => Math.random() * 40 + 10)
    }));

    return {
      powerScoreData,
      currentValue: '70%',
      potential: '30%',
      competitiveStrategy: simId === '1' ? '50%' : '80%',
      patientMix: '20%'
    };
  };

  const handleReview = (sim: Simulation) => {
    console.log('Review button clicked for simulation:', sim);
    console.log('Current showReviewModal state:', showReviewModal);
    setSelectedSimulation(sim);
    setShowReviewModal(true);
    console.log('Called setShowReviewModal(true)');
    // Force a re-check after state update
    setTimeout(() => {
      console.log('After timeout - showReviewModal state:', showReviewModal);
    }, 100);
  };

  const handleEdit = (sim: Simulation) => {
    setSelectedSimulation(sim);
    setShowEditModal(true);
  };

  // Check if any simulations are still running or pending
  const anyRunning = simulations.some(s => s.status === 'running' || s.status === 'pending');

  // When all simulations complete, show them for 2 seconds, then reset to show correct report
  useEffect(() => {
    if (!anyRunning && simulations.every(s => s.status === 'completed')) {
      console.log('[SimulationRunner] All simulations completed, will reset in 2 seconds');
      // Give user 2 seconds to see the completed state, then switch to the correct report view
      setTimeout(() => {
        console.log('[SimulationRunner] Resetting simulationTriggered to show correct report');
        setSimulationTriggered(false);
      }, 2000); // 2 second delay to see completion
    }
  }, [anyRunning, simulations, setSimulationTriggered]);

  return (
    <>
      {/* Always show progress bars view while simulations are active (running, pending, or recently completed) */}
      {(anyRunning || simulations.some(s => s.status === 'completed')) ? (
        /* Progress Bars View - show during and after completion */
        <div style={{
          padding: '32px',
          backgroundColor: 'var(--bg-main)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '24px'
          }}>
            {anyRunning ? 'Running Simulations' : 'Simulations Complete'}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {simulations.map(sim => (
              <div key={sim.id} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                padding: '20px 24px',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                {/* Header: Title + Status Badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {sim.name}
                  </h3>

                  {/* Status badge - green when completed, orange when in progress */}
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: sim.status === 'completed'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                    color: sim.status === 'completed' ? '#10b981' : '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    textTransform: 'lowercase'
                  }}>
                    {sim.status === 'completed' ? 'completed' : 'in progress'}
                  </span>
                </div>

                {/* Labels Row */}
                {sim.config.labels && sim.config.labels.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                  }}>
                    {sim.config.labels.map((label, idx) => (
                      <span key={idx} style={{
                        padding: '4px 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '400',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar Section */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '500'
                    }}>
                      Running simulation
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '500'
                    }}>
                      {Math.round(sim.progress)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${sim.progress}%`,
                      height: '100%',
                      backgroundColor: sim.status === 'completed' ? '#10b981' : '#3b82f6',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {sim.status === 'running' && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animation: 'shimmer 2s infinite'
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      ) : (
        /* Results View - after all simulations complete */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px'
        }}>
          {simulations.map(sim => (
            <div key={sim.id}>
              {sim.status === 'completed' && sim.results ? (
                <SimulationResults
                  simulation={sim}
                  onReview={() => handleReview(sim)}
                  onEdit={() => handleEdit(sim)}
                />
              ) : (
                <SimulationCard simulation={sim} />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Modals */}
      <EditConfigurationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(config) => {
          console.log('Saving configuration:', config);
          setShowEditModal(false);
        }}
      />
      
      <ReviewSimulationModal
        isOpen={showReviewModal}
        onClose={() => {
          console.log('Closing review modal');
          setShowReviewModal(false);
        }}
        simulation={selectedSimulation ? {
          name: selectedSimulation.name,
          status: selectedSimulation.status,
          configuration: {
            establishedProduct: selectedSimulation.config.establishedProduct,
            parameters: selectedSimulation.config.parameters,
            metrics: [
              { name: 'PowerScore (HCP Overall)', weight: 0.7 },
              { name: 'Segment Scores', weight: 0.3 },
              { name: 'Event Activity', weight: 0.4 }
            ]
          },
          results: selectedSimulation.results ? {
            powerScore: '85%',
            reach: '72%',
            frequency: '4.2 calls/month',
            targetingEfficiency: '91%'
          } : undefined
        } : undefined}
        onApprove={() => {
          console.log('Approved simulation:', selectedSimulation);
          setShowReviewModal(false);
        }}
        onReject={() => {
          console.log('Rejected simulation:', selectedSimulation);
          setShowReviewModal(false);
        }}
      />
    </>
  );
};