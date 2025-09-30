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
}

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({ simulations: initialSimulations }) => {
  const { productConfig } = useAppStore();
  const { simulationTriggered, setSimulationTriggered } = useChatStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  
  // Default simulations based on the screenshots
  const defaultSimulations: Simulation[] = [
    {
      id: '1',
      name: 'Value Engine: HCP Targeting Option 1',
      status: 'running',
      progress: 0,
      config: {
        establishedProduct: productConfig.product || '70/30 Value Weighting',
        parameters: []
      }
    },
    {
      id: '2',
      name: 'Value Engine: HCP Targeting Option 2',
      status: 'running',
      progress: 0,
      config: {
        establishedProduct: productConfig.product || '70/30 Value Weighting',
        parameters: ['XPO TRx Weight to 0.2']
      }
    }
  ];

  const [simulations, setSimulations] = useState<Simulation[]>(initialSimulations || defaultSimulations);

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

  return (
    <>
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