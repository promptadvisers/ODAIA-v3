import { create } from 'zustand';
import { useAppStore } from './appStore';

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface PrePrompt {
  id: string;
  text: string;
  action: () => void;
  visible: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  prePrompts: PrePrompt[];
  currentStep: number;
  isTyping: boolean;
  isThinking: boolean;
  isExecutingTask: boolean;
  executingMessage: string;
  simulationTriggered: boolean;
  currentActiveTab: string;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setPrePrompts: (prompts: PrePrompt[]) => void;
  setCurrentStep: (step: number) => void;
  setIsTyping: (typing: boolean) => void;
  setIsThinking: (thinking: boolean) => void;
  setIsExecutingTask: (executing: boolean, message?: string) => void;
  setSimulationTriggered: (triggered: boolean) => void;
  setCurrentActiveTab: (tab: string) => void;
  clearChat: () => void;
  sendUserMessage: (content: string) => void;

  // Demo flow actions
  executeDemoStep: (step: number, userMessage?: string) => void;
  executeSetupStep: (step: number, userMessage?: string, targetSimId?: string) => void;
  generateSetupPrePrompts: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  prePrompts: [],
  currentStep: 0,
  isTyping: false,
  isThinking: false,
  isExecutingTask: false,
  executingMessage: '',
  simulationTriggered: false,
  currentActiveTab: 'brand',

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }]
  })),
  
  setPrePrompts: (prompts) => set({ prePrompts: prompts }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setIsTyping: (typing) => set({ isTyping: typing }),
  
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  
  setIsExecutingTask: (executing, message = '') => set({ 
    isExecutingTask: executing, 
    executingMessage: message 
  }),
  
  setSimulationTriggered: (triggered) => set({ simulationTriggered: triggered }),

  setCurrentActiveTab: (tab) => set({ currentActiveTab: tab }),

  clearChat: () => set({ messages: [], prePrompts: [], currentStep: 0 }),
  
  sendUserMessage: (content: string) => {
    const { addMessage, setIsThinking, setIsTyping } = get();
    
    // Add user message
    addMessage({ type: 'user', content });
    
    // Clear pre-prompts
    set({ prePrompts: [] });
    
    // Generate realistic response after thinking
    const thinkingTime = 1000 + Math.random() * 2000; // 1-3 seconds
    
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      
      // Generate response based on keywords
      let response = '';
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes('simulation') || lowerContent.includes('run')) {
        response = 'I can help you run simulations with various configurations. Would you like to set up a new simulation with your current metrics?';
      } else if (lowerContent.includes('weight') || lowerContent.includes('metric')) {
        response = 'I can adjust metric weights in your configuration. The current weights are optimized for HCP targeting. Which metric would you like to modify?';
      } else if (lowerContent.includes('help') || lowerContent.includes('what can')) {
        response = 'I can help you with:\\n• Configuring brand and product settings\\n• Adjusting metric weights and parameters\\n• Running simulations with different scenarios\\n• Analyzing competitive landscape\\n• Setting up medical objectives\\n\\nWhat would you like to focus on?';
      } else if (lowerContent.includes('status') || lowerContent.includes('configuration')) {
        response = 'Your current configuration status:\\n• Brand settings: Ready\\n• Product configuration: Active\\n• Medical objectives: Pending approval\\n• Competitive landscape: Under review\\n\\nWould you like to review or modify any of these?';
      } else {
        // Default intelligent response
        response = `I understand you're asking about "${content}". Let me check the current configuration and provide relevant options for you.`;
      }
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage({ type: 'agent', content: response });
        
        // Add relevant pre-prompts based on context
        if (lowerContent.includes('simulation')) {
          set({ prePrompts: [
            {
              id: 'sim1',
              text: 'Configure simulation parameters',
              action: () => {},
              visible: true
            },
            {
              id: 'sim2',
              text: 'Run with current settings',
              action: () => {},
              visible: true
            }
          ]});
        }
      }, 500);
    }, thinkingTime);
  },
  
  executeDemoStep: (step, userMessage) => {
    const { addMessage, setPrePrompts, setIsTyping, setIsThinking, setCurrentStep, setIsExecutingTask, setSimulationTriggered } = get();
    const appStore = useAppStore.getState();
    
    // Funny loading messages for different actions
    const loadingMessages = [
      'Configuring Maptual tooling...',
      'Optimizing ODAIA settings...',
      'Syncing with field intelligence...',
      'Calibrating PowerScore algorithms...',
      'Mapping HCP targeting parameters...',
      'Establishing product baskets...',
      'Analyzing configuration parameters...',
      'Processing metric weights...',
      'Validating business rules...'
    ];
    
    // Random thinking time between 1-3 seconds
    const thinkingTime = 1000 + Math.random() * 2000;
    
    // Show thinking state first
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      
      // Small delay before showing response
      setTimeout(() => {
        setIsTyping(false);
      
        switch(step) {
          case 0:
            // Initial state - show multiple prompt options
            setPrePrompts([
              {
                id: '1',
                text: 'List missing or disapproved configurations',
                action: () => get().executeDemoStep(1, 'List missing or disapproved configurations'),
                visible: true
              },
              {
                id: '1b',
                text: 'Show complete brand settings',
                action: () => get().executeDemoStep(1, 'Show complete brand settings'),
                visible: true
              },
              {
                id: '1c',
                text: 'Review configuration status',
                action: () => get().executeDemoStep(1, 'Review configuration status'),
                visible: true
              }
            ]);
            break;
          
          case 1:
            // Step 1: Handle different button texts
            const message = userMessage || 'List missing or disapproved configurations';
            addMessage({ type: 'user', content: message });
            
            // Different responses based on which button was clicked
            let responseContent = '';
            if (message.includes('complete')) {
              responseContent = `Here are your complete brand settings:

**Configured & Ready:**
• Brand identity and positioning ✓
• Target audience segments ✓
• Value propositions ✓
• Core messaging framework ✓

**Configuration Status:**
• Brand Access Strategy: 80% complete
• Medical Objectives: Pending approval
• Sales Goals: Under review
• Competitive Landscape: Active

All primary brand elements are in place. Would you like to review any specific area?`;
            } else if (message.includes('Review')) {
              responseContent = `Configuration Status Overview:

**Ready for Production:**
• Brand Settings - 100%
• Product Configuration - 100%

**Needs Attention:**
• Brand Access Strategy - Missing web portal config
• Medical Objectives - Awaiting approval

**In Progress:**
• Sales Goals - Final review
• Competitive Landscape - Data validation

Which area would you like to address first?`;
            } else {
              responseContent = `I've identified the following items that need attention:

**Missing Information:**
• Brand Access Strategy - Web Portal configuration needed
• Brand Access Strategy - Market Access details required

**Pending Approval:**
• Medical Objectives configuration
• Sales Goals targets
• Competitive Landscape analysis

Would you like me to help configure any of these items?`;
            }
            
            setTimeout(() => {
              addMessage({
                type: 'agent',
                content: responseContent
              });
            
              // Show next prompt options
              setPrePrompts([
                {
                  id: '2',
                  text: 'Change TRx indication weight to 0.5',
                  action: () => get().executeDemoStep(2, 'Change TRx indication weight to 0.5'),
                  visible: true
                },
                {
                  id: '2b',
                  text: 'Adjust metric weights',
                  action: () => get().executeDemoStep(2, 'Adjust metric weights'),
                  visible: true
                },
                {
                  id: '2c',
                  text: 'Update PowerScore configuration',
                  action: () => get().executeDemoStep(2, 'Update PowerScore configuration'),
                  visible: true
                }
              ]);
            }, 500);
            break;
          
          case 2:
            // Step 2: Change metric weight with executing task
            const changeMessage = userMessage || 'Change TRx indication weight to 0.5';
            addMessage({ type: 'user', content: changeMessage });
            
            // Show executing task for 2-4 seconds
            const executeTime = 2000 + Math.random() * 2000;
            setIsExecutingTask(true, loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            
            setTimeout(() => {
              setIsExecutingTask(false);
              
              // Generate response based on message
              let response = '';
              if (changeMessage.includes('0.5')) {
                response = 'Done. The weight for TRx indication has been updated to 0.5. This will impact your PowerScore calculations and HCP targeting priorities.';
              } else if (changeMessage.includes('Adjust')) {
                response = 'I\'ve accessed your metric configuration panel. You can now adjust weights for TRx, NRx, and dollar metrics. What specific changes would you like to make?';
              } else {
                response = 'PowerScore configuration has been updated. The new weights will be applied to your next simulation run.';
              }
              
              addMessage({
                type: 'agent',
                content: response
              });
              
              // Actually update the metric in the store
              const currentMetrics = appStore.productConfig.metrics;
              const updatedMetrics = currentMetrics.map((m: any) =>
                m.name === 'XPO TRx Volume' ? { ...m, weight: 50 } : m
              );
              appStore.updateProductConfig({ metrics: updatedMetrics });
              
              // Show next prompt options
              setPrePrompts([
                {
                  id: '3',
                  text: 'Add XPO dollars metric',
                  action: () => get().executeDemoStep(3, 'Add XPO dollars metric'),
                  visible: true
                },
                {
                  id: '3b',
                  text: 'Include new metric in basket',
                  action: () => get().executeDemoStep(3, 'Include new metric in basket'),
                  visible: true
                }
              ]);
            }, executeTime);
            break;
          
          case 3:
            // Step 3: Add metric with warning
            const addMetricMessage = userMessage || 'Add XPO dollars metric';
            addMessage({ type: 'user', content: addMetricMessage });
            
            // Show executing task animation for 2-4 seconds
            const addMetricTime = 2000 + Math.random() * 2000;
            setIsExecutingTask(true, loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            
            setTimeout(() => {
              setIsExecutingTask(false);
              
              addMessage({
                type: 'agent',
                content: `I've added XPO dollars to the target basket. However, this metric looks important for your HCP targeting strategy. Are you sure you don't want to assign it a weight for the PowerScore calculation?`
              });
              
              // Add the metric to the store
              const currentMetrics = appStore.productConfig.metrics;
              appStore.updateProductConfig({
                metrics: [...currentMetrics, { name: 'xpo_dollars', weight: 0, visualize: false }]
              });
              
              // Show next prompt options
              setPrePrompts([
                {
                  id: '4',
                  text: 'Assign weight of 0.2',
                  action: () => get().executeDemoStep(4, 'Assign weight of 0.2'),
                  visible: true
                },
                {
                  id: '4b',
                  text: 'Keep it with no weight',
                  action: () => get().executeDemoStep(4, 'Keep it with no weight'),
                  visible: true
                }
              ]);
            }, addMetricTime);
            break;
          
          case 4:
            // Step 4: Update weight based on suggestion
            const weightMessage = userMessage || 'Assign weight of 0.2';
            addMessage({ type: 'user', content: weightMessage });
            
            // Show executing task for realistic timing
            const updateWeightTime = 2000 + Math.random() * 2000;
            setIsExecutingTask(true, 'Updating metric weights and recalculating PowerScore...');
            
            setTimeout(() => {
              setIsExecutingTask(false);
              
              let response = '';
              if (weightMessage.includes('0.2')) {
                response = 'Updated. XPO dollars now has a weight of 0.2. Your PowerScore algorithm has been recalibrated to include this metric in HCP targeting calculations.';
                
                // Update the metric weight
                const currentMetrics = appStore.productConfig.metrics;
                const updatedMetrics = currentMetrics.map((m: any) =>
                  m.name === 'xpo_dollars' ? { ...m, weight: 20 } : m
                );
                appStore.updateProductConfig({ metrics: updatedMetrics });
              } else {
                response = 'Understood. XPO dollars will remain in the basket with no weight. It will be tracked but won\'t influence the PowerScore calculations.';
              }
              
              addMessage({
                type: 'agent',
                content: response
              });
              
              // Show simulation prompt
              setPrePrompts([{
                id: '5',
                text: 'Run a Simulation',
                action: () => get().executeDemoStep(5, 'Run a Simulation'),
                visible: true
              }]);
            }, updateWeightTime);
            break;
          
          case 5:
            // Step 5: Initiate simulation
            addMessage({ type: 'user', content: userMessage || 'Run a Simulation' });
            
            setTimeout(() => {
              addMessage({
                type: 'agent',
                content: 'Great! I\'ll help you set up a simulation. What scenarios would you like to run? We can compare your current configuration against modified parameters to find the optimal settings.'
              });
              
              // Show scenario definition prompt options
              setPrePrompts([
                {
                  id: '6',
                  text: 'Run simulation with current and modified configs',
                  action: () => get().executeDemoStep(6, 'Run simulation with current and modified configs'),
                  visible: true
                },
                {
                  id: '6b',
                  text: 'Compare multiple scenarios',
                  action: () => get().executeDemoStep(6, 'Compare multiple scenarios'),
                  visible: true
                }
              ]);
            }, 500);
            break;
          
          case 6:
            // Step 6: Define scenarios
            const simulationConfig = userMessage || 'Run simulation with current and modified configs';
            addMessage({ 
              type: 'user', 
              content: simulationConfig
            });
            
            // Extended executing time for realism (3-5 seconds)
            const simulationPrepTime = 3000 + Math.random() * 2000;
            setIsExecutingTask(true, 'Preparing simulation parameters...');
            
            setTimeout(() => {
              // Change the executing message
              setIsExecutingTask(true, 'Initializing Value Engine simulations...');
              
              setTimeout(() => {
                setIsExecutingTask(false);
                addMessage({
                  type: 'agent',
                  content: 'I\'ve configured two simulation scenarios:\n\n**Scenario 1:** Current configuration\n• XPO TRx: 0.5\n• XPO NRx: 0.2\n• XPO dollars: 0.2\n\n**Scenario 2:** Modified configuration\n• XPO TRx: 0.3\n• XPO NRx: 0.3\n• XPO dollars: 0.4\n\nLaunching simulations now...'
                });
                
                // Set simulation trigger flag and navigate to Report tab
                setTimeout(() => {
                  setSimulationTriggered(true);
                  
                  // Navigate to Report tab using the appStore
                  const appStore = useAppStore.getState();
                  appStore.setActiveSidebarItem('dashboard');
                  
                  // Trigger tab change through a custom event
                  window.dispatchEvent(new CustomEvent('navigateToReport'));
                  
                  addMessage({
                    type: 'agent',
                    content: 'Simulations are now running. You can view the progress in the Report tab.'
                  });
                  
                  // Show result selection prompt after delay
                  setTimeout(() => {
                    setPrePrompts([
                      {
                        id: '7',
                        text: 'Select simulated configuration',
                        action: () => get().executeDemoStep(7, 'Select simulated configuration'),
                        visible: true
                      },
                      {
                        id: '7b',
                        text: 'Apply winning parameters',
                        action: () => get().executeDemoStep(7, 'Apply winning parameters'),
                        visible: true
                      }
                    ]);
                  }, 5000);
                }, 1500);
              }, 2000);
            }, simulationPrepTime);
            break;
          
          case 7:
            // Step 7: Select winning scenario
            const selectMessage = userMessage || 'Select simulated configuration';
            addMessage({ 
              type: 'user', 
              content: selectMessage
            });
            
            // Show executing task for applying configuration
            const applyConfigTime = 2000 + Math.random() * 2000;
            setIsExecutingTask(true, 'Applying winning configuration parameters...');
            
            setTimeout(() => {
              setIsExecutingTask(false);
              
              addMessage({
                type: 'agent',
                content: `Excellent choice! I've updated the master configuration with the winning parameters from Scenario 2. \n\nThe optimized configuration is now active:\n• Improved targeting efficiency: +15%\n• Better HCP reach: +22%\n• Enhanced PowerScore distribution\n\nYour Maptual Field template is ready for deployment.`
              });
              
              // Update configuration with winning parameters
              const currentMetrics = appStore.productConfig.metrics;
              const updatedMetrics = currentMetrics.map((m: any) => {
                if (m.name === 'xpo_dollars') return { ...m, weight: 40 };
                if (m.name === 'XPO TRx Volume') return { ...m, weight: 30 };
                return m;
              });
              appStore.updateProductConfig({ metrics: updatedMetrics });
              
              setCurrentStep(7);
            }, applyConfigTime);
            break;
        }
      }, 500);
    }, thinkingTime);
  },

  // Setup tab specific actions
  generateSetupPrePrompts: () => {
    const appStore = useAppStore.getState();
    const simulations = appStore.simulations;

    if (simulations.length === 0) {
      // No simulations yet, suggest adding one
      set({
        prePrompts: [{
          id: 'setup-1',
          text: 'Add a new simulation scenario',
          action: () => {},
          visible: true
        }]
      });
      return;
    }

    // Generate context-aware prompts for existing simulations
    const prompts: PrePrompt[] = [];

    // Example prompts that modify specific simulations
    if (simulations.length >= 1) {
      prompts.push({
        id: 'setup-2',
        text: `In ${simulations[0].name}, change TRx indication weight to 0.5`,
        action: () => get().executeSetupStep(1, `In ${simulations[0].name}, change TRx indication weight to 0.5`, simulations[0].id),
        visible: true
      });
    }

    if (simulations.length >= 2) {
      prompts.push({
        id: 'setup-3',
        text: `Copy configuration from ${simulations[0].name} to ${simulations[1].name}`,
        action: () => get().executeSetupStep(2, `Copy configuration from ${simulations[0].name} to ${simulations[1].name}`, simulations[1].id),
        visible: true
      });
    }

    if (simulations.length >= 1) {
      prompts.push({
        id: 'setup-4',
        text: `Add XPO dollars metric to ${simulations[0].name} with weight 0.3`,
        action: () => get().executeSetupStep(3, `Add XPO dollars metric to ${simulations[0].name} with weight 0.3`, simulations[0].id),
        visible: true
      });
    }

    prompts.push({
      id: 'setup-5',
      text: 'Update basket weights in all simulations',
      action: () => get().executeSetupStep(4, 'Update basket weights in all simulations'),
      visible: true
    });

    set({ prePrompts: prompts });
  },

  executeSetupStep: (step, userMessage, targetSimId) => {
    const { addMessage, setIsThinking, setIsExecutingTask, setIsTyping } = get();
    const appStore = useAppStore.getState();

    const loadingMessages = [
      'Updating simulation parameters...',
      'Recalculating metric weights...',
      'Applying configuration changes...',
      'Syncing simulation data...',
      'Optimizing PowerScore settings...'
    ];

    const thinkingTime = 1000 + Math.random() * 1500;

    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        if (userMessage) {
          addMessage({ type: 'user', content: userMessage });
        }

        const executeTime = 2000 + Math.random() * 2000;
        setIsExecutingTask(true, loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);

        setTimeout(() => {
          setIsExecutingTask(false);

          let responseContent = '';

          switch (step) {
            case 1:
              // Change metric weight
              if (targetSimId) {
                const simulation = appStore.simulations.find((s: any) => s.id === targetSimId);
                if (simulation) {
                  const updatedMetrics = simulation.valueEngine.metrics.map((m: any) =>
                    m.name === 'XPO TRx Volume' ? { ...m, weight: 50 } : m
                  );
                  appStore.updateSimulation(targetSimId, {
                    valueEngine: { ...simulation.valueEngine, metrics: updatedMetrics }
                  });
                  responseContent = `Done. The weight for TRx indication has been updated to 0.5 in ${simulation.name}. The card has been updated with the new configuration.`;
                }
              }
              break;

            case 2:
              // Copy configuration
              if (targetSimId && appStore.simulations.length >= 2) {
                const sourceSimulation = appStore.simulations[0];
                appStore.updateSimulation(targetSimId, {
                  valueEngine: { ...sourceSimulation.valueEngine }
                });
                responseContent = `Configuration copied from ${sourceSimulation.name} to the target simulation. All metric weights and basket settings have been synchronized.`;
              }
              break;

            case 3:
              // Add metric
              if (targetSimId) {
                const simulation = appStore.simulations.find((s: any) => s.id === targetSimId);
                if (simulation) {
                  const hasMetric = simulation.valueEngine.metrics.some((m: any) => m.name === 'XPO dollars');
                  if (!hasMetric) {
                    const updatedMetrics = [
                      ...simulation.valueEngine.metrics,
                      { name: 'XPO dollars', weight: 30, visualize: true }
                    ];
                    appStore.updateSimulation(targetSimId, {
                      valueEngine: { ...simulation.valueEngine, metrics: updatedMetrics }
                    });
                  }
                  responseContent = `XPO dollars metric added to ${simulation.name} with a weight of 0.3. The PowerScore calculation has been updated.`;
                }
              }
              break;

            case 4:
              // Update all baskets
              appStore.simulations.forEach((sim: any) => {
                appStore.updateSimulation(sim.id, {
                  valueEngine: { ...sim.valueEngine, basketWeight: '8' }
                });
              });
              responseContent = `Basket weights updated to 8 across all ${appStore.simulations.length} simulation scenarios. Changes applied successfully.`;
              break;
          }

          addMessage({
            type: 'agent',
            content: responseContent || 'Configuration updated successfully.'
          });

          // Regenerate prompts for next actions
          setTimeout(() => {
            get().generateSetupPrePrompts();
          }, 500);
        }, executeTime);
      }, 500);
    }, thinkingTime);
  }
}));