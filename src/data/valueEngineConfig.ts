export type AudienceLevel = 'hcp' | 'fsa' | 'regional';

export interface MetricDefinition {
  id: string;
  name: string;
  defaultWeight: number;
  visualize: boolean;
}

export interface MetricGroupDefinition {
  level: AudienceLevel;
  metrics: MetricDefinition[];
}

export interface ProductNode {
  id: string;
  label: string;
  description?: string;
  metricsByLevel: MetricGroupDefinition[];
  children?: ProductNode[];
}

export interface BasketSectionMetric {
  id: string;
  label: string;
  defaultWeight: number;
  visualize: boolean;
}

export interface BasketSectionDefinition {
  id: string;
  label: string;
  basketWeight: number;
  summary?: string;
  products?: string[];
  tabs?: AudienceLevel[];
  metricsByLevel: Record<AudienceLevel, BasketSectionMetric[]>;
}

export interface ValueEngineConfiguration {
  therapeuticArea: string;
  productTree: ProductNode[];
  competitiveSections: BasketSectionDefinition[];
  patientSections: BasketSectionDefinition[];
}

// Metrics that are broadly used across HCP-level analysis
const CORE_HCP_METRICS: MetricDefinition[] = [
  { id: 'xpo_trx', name: 'XPO TRx Volume', defaultWeight: 90, visualize: true },
  { id: 'xpo_nrx', name: 'XPO NRx Volume', defaultWeight: 0, visualize: false },
  { id: 'copay_psp', name: 'OncoThera Copay Card PSP Claims', defaultWeight: 10, visualize: true }
];

const EXPANDED_HCP_METRICS: MetricDefinition[] = [
  ...CORE_HCP_METRICS,
  { id: 'xpo_nbrx', name: 'XPO NBRx Volume', defaultWeight: 0, visualize: false }
];

const CORE_HCP_GROUP: MetricGroupDefinition = {
  level: 'hcp',
  metrics: CORE_HCP_METRICS
};

const EXPANDED_HCP_GROUP: MetricGroupDefinition = {
  level: 'hcp',
  metrics: EXPANDED_HCP_METRICS
};

const FSA_LEVEL_GROUP: MetricGroupDefinition = {
  level: 'fsa',
  metrics: [
    { id: 'fsa_target_access', name: 'Target Account Access Score', defaultWeight: 60, visualize: true },
    { id: 'fsa_volume_growth', name: 'FSA TRx Volume Growth %', defaultWeight: 30, visualize: true },
    { id: 'fsa_field_activity', name: 'Field Calls Completed (rolling 90d)', defaultWeight: 10, visualize: false }
  ]
};

const REGIONAL_LEVEL_GROUP: MetricGroupDefinition = {
  level: 'regional',
  metrics: [
    { id: 'regional_market_share', name: 'Regional Market Share (HER2+ 2L)', defaultWeight: 70, visualize: true },
    { id: 'regional_growth', name: 'Regional TRx Growth', defaultWeight: 20, visualize: true },
    { id: 'regional_unique_metric', name: 'Different Metric here', defaultWeight: 0, visualize: false },
    { id: 'regional_copay', name: 'OncoThera Copay Card PSP Claims', defaultWeight: 10, visualize: true }
  ]
};

export const DEFAULT_AUDIENCE_TABS: AudienceLevel[] = ['hcp', 'fsa', 'regional'];

export const VALUE_ENGINE_CONFIG: ValueEngineConfiguration = {
  therapeuticArea: 'Oncology',
  productTree: [
    {
      id: 'tot-oncology',
      label: 'TOT Oncology MKT',
      metricsByLevel: [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP],
      children: [
        {
          id: 'breast-mkt',
          label: 'Breast Cancer MKT',
          metricsByLevel: [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP],
          children: [
            {
              id: 'cdk46',
              label: 'CDK4/6 Inhibitors',
              metricsByLevel: [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP]
            },
            {
              id: 'her2-therapies',
              label: 'HER2+ Therapies',
              metricsByLevel: [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP],
              children: [
                {
                  id: 'odaiazol',
                  label: 'ODAIAZOL',
                  metricsByLevel: [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP]
                },
                {
                  id: 'perjeta',
                  label: 'PERJETA',
                  metricsByLevel: [EXPANDED_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  competitiveSections: [
    {
      id: 'competitive-potential',
      label: 'Competitive Potential',
      basketWeight: 2,
      products: ['2L HER2+ Therapies', 'PixelTron'],
      tabs: DEFAULT_AUDIENCE_TABS,
      metricsByLevel: {
        hcp: [
          {
            id: 'her2_overall_market_trx',
            label: '2L Therapy HER+ Overall Market, XPO TRx',
            defaultWeight: 80,
            visualize: true
          },
          {
            id: 'pixeltron_nbrx',
            label: 'Competitive brand PixelTron, XPO NBRx',
            defaultWeight: 20,
            visualize: true
          }
        ],
        fsa: [
          {
            id: 'fsa_comp_coverage',
            label: 'Top Competing FSA Coverage %',
            defaultWeight: 60,
            visualize: true
          },
          {
            id: 'fsa_funnel_leak',
            label: 'Competitive Leakage Risk',
            defaultWeight: 40,
            visualize: false
          }
        ],
        regional: [
          {
            id: 'regional_comp_share',
            label: 'Regional Competitive Share',
            defaultWeight: 70,
            visualize: true
          },
          {
            id: 'regional_comp_penetration',
            label: 'Competitive Penetration (PixelTron)',
            defaultWeight: 30,
            visualize: true
          }
        ]
      }
    }
  ],
  patientSections: [
    {
      id: 'patient-potential',
      label: 'Patient Potential (precursor)',
      basketWeight: 1,
      tabs: DEFAULT_AUDIENCE_TABS,
      metricsByLevel: {
        hcp: [
          { id: 'psp_claims', label: 'PSP Claims', defaultWeight: 20, visualize: true },
          { id: 'payer_mix', label: 'Payer mix, Medicaid, Medicare', defaultWeight: 80, visualize: true }
        ],
        fsa: [
          { id: 'fsa_patient_volume', label: 'FSA Patient Volume Signal', defaultWeight: 70, visualize: true },
          { id: 'fsa_psp_participation', label: 'PSP Participation Rate', defaultWeight: 30, visualize: true }
        ],
        regional: [
          {
            id: 'regional_patient_gap',
            label: 'Regional Patient Gap vs Target',
            defaultWeight: 60,
            visualize: true
          },
          {
            id: 'regional_payer_mix',
            label: 'Regional Payer Mix (Medicaid/Medicare)',
            defaultWeight: 40,
            visualize: true
          }
        ]
      }
    }
  ]
};

export const audienceLabelMap: Record<AudienceLevel, string> = {
  hcp: 'HCP',
  fsa: 'FSA',
  regional: 'Regional'
};

export const getMetricsForNode = (node: ProductNode, level: AudienceLevel): MetricDefinition[] => {
  const group = node.metricsByLevel.find((group) => group.level === level);
  return group ? group.metrics : [];
};

export const findNodeById = (nodes: ProductNode[], nodeId: string): ProductNode | undefined => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const childMatch = findNodeById(node.children, nodeId);
      if (childMatch) {
        return childMatch;
      }
    }
  }
  return undefined;
};

export const getDefaultMetricsByLevel = (levels: AudienceLevel[] = DEFAULT_AUDIENCE_TABS): Record<AudienceLevel, MetricDefinition[]> => {
  return levels.reduce((acc, level) => {
    switch (level) {
      case 'hcp':
        acc[level] = CORE_HCP_METRICS;
        break;
      case 'fsa':
        acc[level] = FSA_LEVEL_GROUP.metrics;
        break;
      case 'regional':
        acc[level] = REGIONAL_LEVEL_GROUP.metrics;
        break;
    }
    return acc;
  }, {} as Record<AudienceLevel, MetricDefinition[]>);
};

export const getSectionById = (
  sections: BasketSectionDefinition[],
  sectionId: string
): BasketSectionDefinition | undefined => sections.find((section) => section.id === sectionId);


