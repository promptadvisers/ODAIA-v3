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

export interface ObjectivePreset {
  id: string;
  label: string;
  basketName: string;
  basketWeight: number;
  specialties: string;
  selectedProductIds: string[];
  metricsByLevel: Record<AudienceLevel, Array<{ id: string; weight: number; visualize: boolean }>>;
  competitiveSections: Record<string, Record<AudienceLevel, Array<{ id: string; weight: number; visualize: boolean }>>>;
  patientSections: Record<string, Record<AudienceLevel, Array<{ id: string; weight: number; visualize: boolean }>>>;
  indicationPath: string;
}

export interface ValueEngineConfiguration {
  therapeuticArea: string;
  productTree: ProductNode[];
  competitiveSections: BasketSectionDefinition[];
  patientSections: BasketSectionDefinition[];
  objectives: ObjectivePreset[];
}

// Metrics that are broadly used across HCP-level analysis
const CORE_HCP_METRICS: MetricDefinition[] = [
  { id: 'xpo_trx', name: 'XPO TRx Volume', defaultWeight: 50, visualize: true },
  { id: 'xpo_nbrx', name: 'XPO NBRx Volume', defaultWeight: 30, visualize: true },
  { id: 'psp_enrollment', name: 'OncoThera PSP Enrollment Rate', defaultWeight: 20, visualize: true }
];

const EXPANDED_HCP_METRICS: MetricDefinition[] = [
  ...CORE_HCP_METRICS,
  { id: 'hcp_switch_rate', name: 'Switch-In Rate from T-DM1', defaultWeight: 15, visualize: true }
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
    { id: 'fsa_target_access', name: 'Target Account Access Score', defaultWeight: 45, visualize: true },
    { id: 'fsa_volume_growth', name: 'FSA TRx Volume Growth %', defaultWeight: 30, visualize: true },
    { id: 'fsa_field_activity', name: 'Field Calls Completed (rolling 90d)', defaultWeight: 15, visualize: false },
    { id: 'fsa_pull_through', name: 'Pull-Through Program Adoption', defaultWeight: 10, visualize: true }
  ]
};

const REGIONAL_LEVEL_GROUP: MetricGroupDefinition = {
  level: 'regional',
  metrics: [
    { id: 'regional_market_share', name: 'Regional Market Share (Key Oncology Segments)', defaultWeight: 55, visualize: true },
    { id: 'regional_growth', name: 'Regional TRx Growth', defaultWeight: 20, visualize: true },
    { id: 'regional_access_gap', name: 'Access Gap vs Target Plans', defaultWeight: 15, visualize: true },
    { id: 'regional_copay', name: 'OncoThera Copay Card PSP Claims', defaultWeight: 10, visualize: true }
  ]
};

const DEFAULT_METRIC_GROUPS: MetricGroupDefinition[] = [CORE_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP];
const EXPANDED_METRIC_GROUPS: MetricGroupDefinition[] = [EXPANDED_HCP_GROUP, FSA_LEVEL_GROUP, REGIONAL_LEVEL_GROUP];

export const DEFAULT_AUDIENCE_TABS: AudienceLevel[] = ['hcp', 'fsa', 'regional'];

export const VALUE_ENGINE_CONFIG: ValueEngineConfiguration = {
  therapeuticArea: 'Oncology',
  productTree: [
    {
      id: 'tot-oncology',
      label: 'TOT Oncology MKT',
      metricsByLevel: EXPANDED_METRIC_GROUPS,
      children: [
        {
          id: 'breast-mkt',
          label: 'Breast Cancer MKT',
          metricsByLevel: EXPANDED_METRIC_GROUPS,
          children: [
            {
              id: 'cdk46',
              label: 'CDK4/6 INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'ibrance', label: 'IBRANCE', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'kisqali', label: 'KISQALI', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'verzenio', label: 'VERZENIO', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'dal-piciclib', label: 'DAL PICICLIB', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'prilaciclib', label: 'PRILACICLIB', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            },
            {
              id: 'her2-therapies',
              label: 'HER2+ THERAPIES',
              metricsByLevel: EXPANDED_METRIC_GROUPS,
              children: [
                { id: 'odaiazol', label: 'ODAIAZOL', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'perjeta', label: 'PERJETA', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'kadcyla', label: 'KADCYLA', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'enhertu', label: 'ENHERTU', metricsByLevel: EXPANDED_METRIC_GROUPS }
              ]
            },
            {
              id: 'parp-inhibitors',
              label: 'PARP INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'lynparza', label: 'LYNPARZA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'talzenna', label: 'TALZENNA', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            }
          ]
        },
        {
          id: 'lung-mkt',
          label: 'LUNG CANCER MKT',
          metricsByLevel: EXPANDED_METRIC_GROUPS,
          children: [
            {
              id: 'egfr-inhibitors',
              label: 'EGFR INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'iressa', label: 'IRESSA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'tarceva', label: 'TARCEVA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'gilotrif', label: 'GILOTRIF', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'vizimpro', label: 'VIZIMPRO', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'tagrisso', label: 'TAGRISSO', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'exkivity', label: 'EXKIVITY', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'lumakras', label: 'LUMAKRAS', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'rybrevant', label: 'RYBREVANT', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'datroway', label: 'DATROWAY', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            },
            {
              id: 'alk-inhibitors',
              label: 'ALK INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'alecensa', label: 'ALECENSA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'alunbrig', label: 'ALUNBRIG', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'xalkori', label: 'XALKORI', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'lorbrena', label: 'LORBRENA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'zykadia', label: 'ZYKADIA', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            },
            {
              id: 'io-therapies',
              label: 'IMMUNOTHERAPIES (IO)',
              metricsByLevel: EXPANDED_METRIC_GROUPS,
              children: [
                { id: 'keytruda', label: 'KEYTRUDA', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'opdivo', label: 'OPDIVO', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'tecentriq', label: 'TECENTRIQ', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'imfinzi', label: 'IMFINZI', metricsByLevel: EXPANDED_METRIC_GROUPS },
                { id: 'libtayo', label: 'LIBTAYO', metricsByLevel: EXPANDED_METRIC_GROUPS }
              ]
            }
          ]
        },
        {
          id: 'hematological-mkt',
          label: 'HEMATOLOGICAL MKT',
          metricsByLevel: EXPANDED_METRIC_GROUPS,
          children: [
            {
              id: 'btk-inhibitors',
              label: 'BTK INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'imbruvica', label: 'IMBRUVICA', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'calquence', label: 'CALQUENCE', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'brukinsa', label: 'BRUKINSA', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            },
            {
              id: 'bcl2-inhibitors',
              label: 'BCL-2 INHIBITORS',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'vencl', label: 'VENCLEXTA', metricsByLevel: DEFAULT_METRIC_GROUPS }
              ]
            },
            {
              id: 'other-hematological',
              label: 'OTHER HEMATOLOGICAL THERAPIES',
              metricsByLevel: DEFAULT_METRIC_GROUPS,
              children: [
                { id: 'velcade', label: 'VELCADE', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'darzalex', label: 'DARZALEX', metricsByLevel: DEFAULT_METRIC_GROUPS },
                { id: 'blincyto', label: 'BLINCYTO / BISPECIFICS', metricsByLevel: DEFAULT_METRIC_GROUPS }
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
      products: ['2L HER2+ Therapies', 'Vectoral'],
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
            id: 'vectoral_nbrx',
            label: 'Competitive brand Vectoral, XPO NBRx',
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
            label: 'Competitive Penetration (Vectoral)',
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
  ],
  objectives: [
    {
      id: 'odaiazol',
      label: 'Odaiazol Objective',
      basketName: 'Odaiazol',
      basketWeight: 7,
      specialties: 'Oncology',
      selectedProductIds: ['odaiazol'],
      metricsByLevel: {
        hcp: [
          { id: 'xpo_trx', weight: 55, visualize: true },
          { id: 'xpo_nbrx', weight: 30, visualize: true },
          { id: 'psp_enrollment', weight: 15, visualize: true }
        ],
        fsa: [
          { id: 'fsa_target_access', weight: 40, visualize: true },
          { id: 'fsa_volume_growth', weight: 30, visualize: true },
          { id: 'fsa_field_activity', weight: 20, visualize: false },
          { id: 'fsa_pull_through', weight: 10, visualize: true }
        ],
        regional: [
          { id: 'regional_market_share', weight: 50, visualize: true },
          { id: 'regional_growth', weight: 20, visualize: true },
          { id: 'regional_access_gap', weight: 20, visualize: true },
          { id: 'regional_copay', weight: 10, visualize: true }
        ]
      },
      competitiveSections: {
        'competitive-potential': {
          hcp: [
            { id: 'her2_overall_market_trx', weight: 75, visualize: true },
            { id: 'vectoral_nbrx', weight: 25, visualize: true }
          ],
          fsa: [
            { id: 'fsa_comp_coverage', weight: 55, visualize: true },
            { id: 'fsa_funnel_leak', weight: 45, visualize: false }
          ],
          regional: [
            { id: 'regional_comp_share', weight: 65, visualize: true },
            { id: 'regional_comp_penetration', weight: 35, visualize: true }
          ]
        }
      },
      patientSections: {
        'patient-potential': {
          hcp: [
            { id: 'psp_claims', weight: 25, visualize: true },
            { id: 'payer_mix', weight: 75, visualize: true }
          ],
          fsa: [
            { id: 'fsa_patient_volume', weight: 60, visualize: true },
            { id: 'fsa_psp_participation', weight: 40, visualize: true }
          ],
          regional: [
            { id: 'regional_patient_gap', weight: 55, visualize: true },
            { id: 'regional_payer_mix', weight: 45, visualize: true }
          ]
        }
      },
      indicationPath: 'Breast Cancer MKT › HER2+ Therapies › ODAIAZOL'
    },
    {
      id: 'vectoral',
      label: 'Vectoral Objective',
      basketName: 'Vectoral Respiratory',
      basketWeight: 6,
      specialties: 'Pulmonology',
      selectedProductIds: ['tagrisso', 'keytruda'],
      metricsByLevel: {
        hcp: [
          { id: 'xpo_trx', weight: 50, visualize: true },
          { id: 'xpo_nbrx', weight: 35, visualize: true },
          { id: 'psp_enrollment', weight: 15, visualize: true }
        ],
        fsa: [
          { id: 'fsa_target_access', weight: 35, visualize: true },
          { id: 'fsa_volume_growth', weight: 35, visualize: true },
          { id: 'fsa_field_activity', weight: 20, visualize: true },
          { id: 'fsa_pull_through', weight: 10, visualize: true }
        ],
        regional: [
          { id: 'regional_market_share', weight: 45, visualize: true },
          { id: 'regional_growth', weight: 25, visualize: true },
          { id: 'regional_access_gap', weight: 20, visualize: true },
          { id: 'regional_copay', weight: 10, visualize: true }
        ]
      },
      competitiveSections: {
        'competitive-potential': {
          hcp: [
            { id: 'her2_overall_market_trx', weight: 60, visualize: true },
            { id: 'vectoral_nbrx', weight: 40, visualize: true }
          ],
          fsa: [
            { id: 'fsa_comp_coverage', weight: 50, visualize: true },
            { id: 'fsa_funnel_leak', weight: 50, visualize: true }
          ],
          regional: [
            { id: 'regional_comp_share', weight: 55, visualize: true },
            { id: 'regional_comp_penetration', weight: 45, visualize: true }
          ]
        }
      },
      patientSections: {
        'patient-potential': {
          hcp: [
            { id: 'psp_claims', weight: 35, visualize: true },
            { id: 'payer_mix', weight: 65, visualize: true }
          ],
          fsa: [
            { id: 'fsa_patient_volume', weight: 55, visualize: true },
            { id: 'fsa_psp_participation', weight: 45, visualize: true }
          ],
          regional: [
            { id: 'regional_patient_gap', weight: 50, visualize: true },
            { id: 'regional_payer_mix', weight: 50, visualize: true }
          ]
        }
      },
      indicationPath: 'Lung Cancer MKT › EGFR Inhibitors › TAGRISSO'
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


