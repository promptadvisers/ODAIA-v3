import { create } from 'zustand';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

interface BrandConfig {
  brand: {
    status: 'Ready' | 'Missing info' | 'Pending';
    tags: string[];
    description: string;
    approved: boolean;
  };
  brandAccess: {
    status: 'Ready' | 'Missing info' | 'Pending';
    pspProgram: string;
    finicalSupport: string;
    webPortal: string;
    marketAccess: string;
    approved: boolean;
  };
  salesGoals: {
    status: 'Ready' | 'Missing info' | 'Pending';
    description?: string;
    approved: boolean;
  };
  competitiveLandscape: {
    status: 'Ready' | 'Missing info' | 'Pending';
    tags?: string[];
    description?: string;
    approved: boolean;
  };
  medicalObjectives: {
    status: 'Ready' | 'Missing info' | 'Pending';
    basketName: string;
    basketScore: number;
    therapeuticArea: string;
    product: string;
    indications: string[];
    scoringWeights: Array<{
      metric: string;
      weight: number;
      baseline: boolean;
      percentile: boolean;
    }>;
    approved: boolean;
  };
}

interface ProductConfiguration {
  basketName: string;
  basketWeight: string;
  therapeuticArea: string;
  product: string;
  indication: string;
  specialties: string;
  metrics: Array<{
    name: string;
    weight: number;
    visualize: boolean;
  }>;
  competitiveOpportunities: any[];
  precursor: any[];
  analog: any[];
}

export interface Product {
  id: string;
  name: string;
  indication: string;
  therapeuticArea: string;
  launchStatus: 'Established' | 'New Launch' | 'Pre-Launch';
}

export interface SimulationScenario {
  id: string;
  name: string;
  product: Product;
  valueEngine: {
    product: string;
    therapeuticArea: string;
    indication: string;
    metrics: Array<{
      name: string;
      weight: number;
      visualize: boolean;
    }>;
    basketWeight: string;
  };
  curationEngine?: {
    suggestionsPerWeek: string;
    signals: number;
    strategy: string;
    reachFrequency: string;
  };
  status: 'draft' | 'configured';
  createdAt: Date;
  approved: boolean;
}

type SetupApprovalKey = 'valueEngine' | 'orchestration' | 'curation';

interface AppState {
  // File management
  uploadedFiles: UploadedFile[];
  addFile: (file: File) => void;
  removeFile: (id: string) => void;
  isProcessingFile: boolean;
  setIsProcessingFile: (processing: boolean) => void;
  hasUploadedFiles: boolean;
  
  // Brand configuration
  brandConfig: BrandConfig;
  updateBrandConfig: (config: BrandConfig) => void;
  updateBrandAccess: (data: Partial<BrandConfig['brandAccess']>) => void;
  approveBrandItem: (item: keyof BrandConfig) => void;
  updateBrandItem: (item: keyof BrandConfig, data: any) => void;
  
  // Product configuration (new)
  productConfig: ProductConfiguration;
  updateProductConfig: (data: Partial<ProductConfiguration>) => void;
  
  // UI State
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  editingCardType: 'medicalObjectives' | 'brandAccess' | 'salesGoals' | 'competitiveLandscape' | 'hcp-targeting' | 'call-plan' | null;
  setEditingCardType: (cardType: 'medicalObjectives' | 'brandAccess' | 'salesGoals' | 'competitiveLandscape' | 'hcp-targeting' | 'call-plan' | null) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Sidebar
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;

  // Workflow
  selectedWorkflow: 'sales' | 'marketing';
  setSelectedWorkflow: (workflow: 'sales' | 'marketing') => void;
  setupReady: boolean;
  setSetupReady: (ready: boolean) => void;
  setupApprovals: Record<SetupApprovalKey, boolean>;
  setSetupApproval: (item: SetupApprovalKey, approved: boolean) => void;
  approveAllSetup: (workflow: 'sales' | 'marketing') => void;

  // Simulations
  simulations: SimulationScenario[];
  addSimulation: (simulation: Omit<SimulationScenario, 'id' | 'createdAt' | 'approved'>) => void;
  updateSimulation: (id: string, updates: Partial<SimulationScenario>) => void;
  removeSimulation: (id: string) => void;
  getSimulationById: (id: string) => SimulationScenario | undefined;
  setSimulationApproval: (id: string, approved: boolean) => void;

  // PSP Metric Demo
  pspMetricAdded: boolean;
  setPspMetricAdded: (added: boolean) => void;
}

// Mock products data - must be defined before the store
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Odaiazol',
    indication: '2L HER2+ Metastatic Breast Cancer',
    therapeuticArea: 'Oncology',
    launchStatus: 'Established'
  },
  {
    id: 'prod-2',
    name: 'Nucala',
    indication: 'Severe Eosinophilic Asthma',
    therapeuticArea: 'Respiratory',
    launchStatus: 'Established'
  },
  {
    id: 'prod-3',
    name: 'Fasenra',
    indication: 'Severe Eosinophilic Asthma',
    therapeuticArea: 'Respiratory',
    launchStatus: 'Established'
  },
  {
    id: 'prod-4',
    name: 'Xolair',
    indication: 'Chronic Spontaneous Urticaria',
    therapeuticArea: 'Immunology',
    launchStatus: 'Established'
  },
  {
    id: 'prod-5',
    name: 'Dupixent',
    indication: 'Moderate-to-Severe Atopic Dermatitis',
    therapeuticArea: 'Dermatology',
    launchStatus: 'New Launch'
  },
  {
    id: 'prod-6',
    name: 'Keytruda',
    indication: 'Non-Small Cell Lung Cancer',
    therapeuticArea: 'Oncology',
    launchStatus: 'Established'
  }
];

const SIMULATIONS_STORAGE_KEY = 'setupSimulations';
const STORAGE_VERSION_KEY = 'appStorageVersion';
const CURRENT_STORAGE_VERSION = '2'; // Increment this to clear all localStorage

const loadStoredSimulations = (): SimulationScenario[] => {
  try {
    // Check storage version and clear if outdated
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_STORAGE_VERSION) {
      console.log('Storage version mismatch - clearing localStorage');
      localStorage.clear();
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
      localStorage.setItem(SIMULATIONS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    const stored = localStorage.getItem(SIMULATIONS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(SIMULATIONS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((simulation: SimulationScenario & { createdAt?: string | number }) => ({
      ...simulation,
      createdAt: simulation.createdAt ? new Date(simulation.createdAt) : new Date()
    }));
  } catch (error) {
    console.error('Failed to load simulations from storage:', error);
    return [];
  }
};

const persistSimulations = (simulations: SimulationScenario[]) => {
  try {
    localStorage.setItem(SIMULATIONS_STORAGE_KEY, JSON.stringify(simulations));
  } catch (error) {
    console.error('Failed to persist simulations:', error);
  }
};

export const useAppStore = create<AppState>((set): AppState => ({
  // File management
  uploadedFiles: JSON.parse(localStorage.getItem('uploadedFiles') || '[]'),
  isProcessingFile: false,
  hasUploadedFiles: JSON.parse(localStorage.getItem('uploadedFiles') || '[]').length > 0,
  setIsProcessingFile: (processing) => set({ isProcessingFile: processing }),
  addFile: (file) => set((state) => {
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date()
    };
    const updatedFiles = [...state.uploadedFiles, newFile];
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    
    // Start processing simulation
    set({ isProcessingFile: true, hasUploadedFiles: true });
    setTimeout(() => {
      set({ isProcessingFile: false });
    }, 3000); // Simulate 3 seconds of processing
    
    return { uploadedFiles: updatedFiles };
  }),
  removeFile: (id) => set((state) => {
    const updatedFiles = state.uploadedFiles.filter(f => f.id !== id);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    return { uploadedFiles: updatedFiles, hasUploadedFiles: updatedFiles.length > 0 };
  }),
  
  // Brand configuration
  brandConfig: {
    brand: {
      status: 'Ready',
      tags: ['Oncology', 'Solid Tumors', 'Breast Cancer'],
      description: 'Within the oncology vertical, the therapeutic area of breast cancer includes the HER2+ indication, where the antibody-drug conjugate (ADC) drug class competes, and products progress through a life cycle from launch in 2L metastatic disease to expansion into earlier lines and adjacent populations',
      approved: false
    },
    brandAccess: {
      status: 'Missing info',
      pspProgram: 'OncoConnect PSP',
      finicalSupport: 'OncoThera Copay Card',
      webPortal: '',
      marketAccess: '',
      approved: false
    },
    salesGoals: {
      status: 'Ready',
      description: 'Focus on driving a sustained increase in TRx volume in the 2L HER2+ metastatic breast cancer segment by expanding adoption among high-volume oncologists, capturing switches from T-DM1, and supporting persistence through PSP and copay programs',
      approved: false
    },
    competitiveLandscape: {
      status: 'Ready',
      tags: ['T-DM1', 'T-DXd', 'Sacituzumab'],
      description: 'The HER2+ metastatic breast cancer landscape includes key competitors like T-DM1 (established market leader), T-DXd (emerging threat with strong efficacy data), and Sacituzumab (growing adoption in triple-negative subset). Differentiation through safety profile and access programs is critical.',
      approved: false
    },
    medicalObjectives: {
      status: 'Ready',
      basketName: 'Target Product Nacida',
      basketScore: 7,
      therapeuticArea: '',
      product: '',
      indications: ['SEA', 'NP'],
      scoringWeights: [
        { metric: 'IOVIA TRx Share Monthly', weight: 50, baseline: true, percentile: false },
        { metric: '2L Therapy HER+ Market', weight: 50, baseline: true, percentile: false },
        { metric: 'XPO TRx', weight: 50, baseline: true, percentile: false },
        { metric: 'NBRx Opportunity', weight: 50, baseline: true, percentile: false }
      ],
      approved: false
    }
  },
  updateBrandAccess: (data) => set((state) => ({
    brandConfig: {
      ...state.brandConfig,
      brandAccess: {
        ...state.brandConfig.brandAccess,
        ...data,
        status: data.webPortal && data.marketAccess ? 'Ready' : 'Missing info'
      }
    }
  })),
  approveBrandItem: (item) => set((state) => ({
    brandConfig: {
      ...state.brandConfig,
      [item]: {
        ...state.brandConfig[item],
        approved: true
      }
    }
  })),
  updateBrandItem: (item, data) => set((state) => ({
    brandConfig: {
      ...state.brandConfig,
      [item]: {
        ...state.brandConfig[item],
        ...data
      }
    }
  })),
  updateBrandConfig: (config) => set({ brandConfig: config }),
  
  // Product configuration (new)
  productConfig: {
    basketName: 'Odaiazol',
    basketWeight: '7',
    therapeuticArea: 'Oncology',
    product: 'Odaiazol',
    indication: '2L Therapy HER+',
    specialties: '',
    metrics: [
      { name: 'XPO TRx Volume', weight: 100, visualize: true },
      { name: 'XPO NRx Volume', weight: 0, visualize: false },
      { name: 'XPO NBRx Volume', weight: 0, visualize: false }
    ],
    competitiveOpportunities: [],
    precursor: [],
    analog: []
  },
  updateProductConfig: (data) => set((state) => ({
    productConfig: {
      ...state.productConfig,
      ...data
    }
  })),
  
  // UI State
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  editingCardType: null,
  setEditingCardType: (cardType) => set({ editingCardType: cardType }),
  
  // Theme
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
  
  // Sidebar
  activeSidebarItem: '',
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),

  // Workflow
  selectedWorkflow: 'sales',
  setSelectedWorkflow: (workflow) => set({ selectedWorkflow: workflow }),
  setupReady: false,
  setSetupReady: (ready) => set({ setupReady: ready }),
  setupApprovals: {
    valueEngine: false,
    orchestration: false,
    curation: false
  },
  setSetupApproval: (item, approved) => set((state) => ({
    setupApprovals: {
      ...state.setupApprovals,
      [item]: approved
    }
  })),
  approveAllSetup: (workflow) =>
    set((state) => {
      const updatedSimulations = state.simulations.map((sim: SimulationScenario) => ({
        ...sim,
        approved: true
      }));
      persistSimulations(updatedSimulations);
      return {
        setupApprovals: {
          valueEngine: true,
          orchestration: workflow === 'marketing' ? true : state.setupApprovals.orchestration,
          curation: workflow === 'sales' ? true : state.setupApprovals.curation
        },
        simulations: updatedSimulations
      };
    }),

  // Simulations
  simulations: loadStoredSimulations(),
  addSimulation: (simulation) => set((state) => {
    const newSimulation: SimulationScenario = {
      ...simulation,
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      approved: false
    };
    const updatedSimulations = [...state.simulations, newSimulation];
    persistSimulations(updatedSimulations);
    return { simulations: updatedSimulations };
  }),
  updateSimulation: (id, updates) => set((state) => {
    const updatedSimulations = state.simulations.map(sim =>
      sim.id === id ? { ...sim, ...updates } : sim
    );
    persistSimulations(updatedSimulations);
    return { simulations: updatedSimulations };
  }),
  removeSimulation: (id) => set((state) => {
    const updatedSimulations = state.simulations.filter((sim: SimulationScenario) => sim.id !== id);
    persistSimulations(updatedSimulations);
    return { simulations: updatedSimulations };
  }),
  getSimulationById: (id): SimulationScenario | undefined => {
    const state: AppState = useAppStore.getState();
    return state.simulations.find((sim: SimulationScenario) => sim.id === id);
  },
  setSimulationApproval: (id, approved) =>
    set((state) => ({
      simulations: state.simulations.map((sim: SimulationScenario) =>
        sim.id === id ? { ...sim, approved } : sim
      )
    })),

  // PSP Metric Demo
  pspMetricAdded: false,
  setPspMetricAdded: (added) => set({ pspMetricAdded: added })
}));