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
  config: {
    establishedProduct: string;
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

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({ simulations: initialSimulations, configuredScenarios }) => {
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
        id: 'original-value-engine',
        name: 'Value Engine: HCP Targeting',
        status: 'pending',
        progress: 0,
        config: {
          establishedProduct: productConfig.product || 'Odaiazol',
          parameters: []
        }
      },
      {
        id: 'original-curation-engine',
        name: 'Curation Engine: Call Plan',
        status: 'pending',
        progress: 0,
        config: {
          establishedProduct: productConfig.product || 'Odaiazol',
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
      // Start simulations automatically
      setSimulations(prev => prev.map(sim => ({
        ...sim,
        status: 'running',
        progress: 0
      })));
      
      // Reset the trigger
      setSimulationTriggered(false);
    }
  }, [simulationTriggered, setSimulationTriggered]);

  // Simulate progress for running simulations
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulations(prev => prev.map(sim => {
        if (sim.status === 'running' && sim.progress < 100) {
          const newProgress = Math.min(sim.progress + Math.random() * 15, 100);
          
          // Complete simulation when progress reaches 100
          if (newProgress >= 100) {
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
      }));
    }, 500);

    return () => clearInterval(interval);
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

  return (
    <>
      {anyRunning ? (
        /* Parallel Progress Bars View */
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
            Running Simulations
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
                padding: '24px',
                border: '1px solid var(--border-subtle)'
              }}>
                {/* Simulation Name and Status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: sim.status === 'completed' ? '#10b981' : 'var(--accent-blue)'
                  }}>
                    {sim.status === 'completed' ? 'Completed' : `${Math.round(sim.progress)}%`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${sim.progress}%`,
                    height: '100%',
                    backgroundColor: sim.status === 'completed' ? '#10b981' : 'var(--accent-blue)',
                    borderRadius: '4px',
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

                {/* Product Details */}
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Product: {sim.config.establishedProduct}
                  {sim.config.parameters.length > 0 && (
                    <span style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>
                      • {sim.config.parameters.join(', ')}
                    </span>
                  )}
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