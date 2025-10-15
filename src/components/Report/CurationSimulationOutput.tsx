import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type SimulationId = 'simulation-1' | 'simulation-2' | 'simulation-3';

interface MetricBlock {
  title: string;
  value: string | number;
  sublabel?: string;
}

interface LiftVariant {
  label: string;
  value: number;
}

interface LiftEntry {
  label: string;
  value: number;
  variants?: LiftVariant[];
}

interface HistoryRow {
  date: string;
  ca: number;
  nca: number;
  ncna: number;
}

interface SimulationConfig {
  id: SimulationId;
  title: string;
  heroStats: MetricBlock[];
  secondaryStats: MetricBlock[];
  liftTable: LiftEntry[];
  kpiHistory: HistoryRow[];
  summaryBullets: string[];
}

const SIMULATION_CONTENT: Record<SimulationId, SimulationConfig> = {
  'simulation-1': {
    id: 'simulation-1',
    title: 'Odaiazol 80/20',
    heroStats: [
      { title: 'Eventual Week', value: 2 },
      { title: 'Annual Projected Incremental Value', value: 124 },
      { title: 'Relative Waste Reduction (RWR)', value: '41.1%' }
    ],
    secondaryStats: [
      { title: 'Projects selected from', value: '02/19/2025' },
      { title: 'Projects selected to', value: '09/23/2025' },
      { title: 'Number of Projects', value: 16 },
      { title: 'In kit calc analysis', value: 3 },
      { title: 'Engagement Window', value: 1 }
    ],
    liftTable: [
      { label: 'Lift per 1K HCP (CA)', value: 3280 },
      {
        label: 'Lift per 1K HCP (CNA)',
        value: 1740,
        variants: [
          { label: 'Lift per 1K HCP (CNeverA)', value: 1120 },
          { label: 'Lift per 1K HCP (CEventuallyA)', value: 2530 }
        ]
      },
      { label: 'Lift per 1K HCP (NCA)', value: 990 },
      {
        label: 'Lift per 1K HCP (NCNA)',
        value: 470,
        variants: [
          { label: 'Lift per 1K HCP (NCNeverA)', value: 280 },
          { label: 'Lift per 1K HCP (NCE EventuallyA)', value: 690 }
        ]
      }
    ],
    kpiHistory: [
      { date: '2025-06-01', ca: 6.5, nca: 2.1, ncna: 1.1 },
      { date: '2025-07-15', ca: 6.9, nca: 2.3, ncna: 1.3 },
      { date: '2025-08-15', ca: 7.4, nca: 2.6, ncna: 1.5 },
      { date: '2025-09-23', ca: 7.6, nca: 2.8, ncna: 1.6 }
    ],
    summaryBullets: [
      'Lift per 1K HCP (CA) – 61.3',
      'Lift per 1K HCP (CNA) – 29.5',
      'Lift per 1K HCP (NCA) – 33.9',
      'Lift per 1K HCP (NCNA) – 17.0',
      'HCPs Curated – 2.4%',
      'Adherence – 5.1%',
      'Coverage – 7.4%'
    ]
  },
  'simulation-2': {
    id: 'simulation-2',
    title: 'Odaiazol 60/40',
    heroStats: [
      { title: 'Eventual Week', value: 2 },
      { title: 'Annual Projected Incremental Value', value: 89 },
      { title: 'Relative Waste Reduction (RWR)', value: '41.1%' }
    ],
    secondaryStats: [
      { title: 'Projects selected from', value: '02/19/2025' },
      { title: 'Projects selected to', value: '08/22/2025' },
      { title: 'Number of Projects', value: 16 },
      { title: 'In kit calc analysis', value: 3 },
      { title: 'Engagement Window', value: 1 }
    ],
    liftTable: [
      { label: 'Lift per 1K HCP (CA)', value: 1860 },
      {
        label: 'Lift per 1K HCP (CNA)',
        value: 980,
        variants: [
          { label: 'Lift per 1K HCP (CNeverA)', value: 640 },
          { label: 'Lift per 1K HCP (CEventuallyA)', value: 1290 }
        ]
      },
      { label: 'Lift per 1K HCP (NCA)', value: 1240 },
      {
        label: 'Lift per 1K HCP (NCNA)',
        value: 620,
        variants: [
          { label: 'Lift per 1K HCP (NCNeverA)', value: 380 },
          { label: 'Lift per 1K HCP (NCE EventuallyA)', value: 830 }
        ]
      }
    ],
    kpiHistory: [
      { date: '2025-06-01', ca: 4.8, nca: 2.9, ncna: 1.5 },
      { date: '2025-07-15', ca: 5.1, nca: 3.0, ncna: 1.6 },
      { date: '2025-08-15', ca: 5.4, nca: 3.2, ncna: 1.7 },
      { date: '2025-09-23', ca: 5.6, nca: 3.3, ncna: 1.9 }
    ],
    summaryBullets: [
      'Lift per 1K HCP (CA) – 35.7',
      'Lift per 1K HCP (CNA) – 27.7',
      'Lift per 1K HCP (NCA) – 21.1',
      'Lift per 1K HCP (NCNA) – 16.8',
      'HCPs Curated – 2.4%',
      'Adherence – 5.1%',
      'Coverage – 7.4%'
    ]
  },
  'simulation-3': {
    id: 'simulation-3',
    title: 'Odaiazol 40/60',
    heroStats: [
      { title: 'Eventual Week', value: 2 },
      { title: 'Annual Projected Incremental Value', value: 52 },
      { title: 'Relative Waste Reduction (RWR)', value: '17.8%' }
    ],
    secondaryStats: [
      { title: 'Projects selected from', value: '02/19/2025' },
      { title: 'Projects selected to', value: '07/10/2025' },
      { title: 'Number of Projects', value: 14 },
      { title: 'In kit calc analysis', value: 2 },
      { title: 'Engagement Window', value: 1 }
    ],
    liftTable: [
      { label: 'Lift per 1K HCP (CA)', value: 720 },
      {
        label: 'Lift per 1K HCP (CNA)',
        value: 340,
        variants: [
          { label: 'Lift per 1K HCP (CNeverA)', value: 230 },
          { label: 'Lift per 1K HCP (CEventuallyA)', value: 470 }
        ]
      },
      { label: 'Lift per 1K HCP (NCA)', value: 940 },
      {
        label: 'Lift per 1K HCP (NCNA)',
        value: 310,
        variants: [
          { label: 'Lift per 1K HCP (NCNeverA)', value: 180 },
          { label: 'Lift per 1K HCP (NCE EventuallyA)', value: 420 }
        ]
      }
    ],
    kpiHistory: [
      { date: '2025-06-01', ca: 2.9, nca: 2.7, ncna: 1.9 },
      { date: '2025-07-15', ca: 3.1, nca: 2.8, ncna: 2.0 },
      { date: '2025-08-15', ca: 3.0, nca: 2.9, ncna: 2.1 },
      { date: '2025-09-23', ca: 3.2, nca: 3.0, ncna: 2.2 }
    ],
    summaryBullets: [
      'Lift per 1K HCP (CA) – 24.3',
      'Lift per 1K HCP (CNA) – 11.7',
      'Lift per 1K HCP (NCA) – 18.6',
      'Lift per 1K HCP (NCNA) – 9.8',
      'HCPs Curated – 1.1%',
      'Adherence – 3.4%',
      'Coverage – 4.2%'
    ]
  }
};

interface CurationSimulationOutputProps {
  onSimulationChange?: (simulationId: SimulationId) => void;
}

export const CurationSimulationOutput: React.FC<CurationSimulationOutputProps> = ({ onSimulationChange }) => {
  const [activeSimulation, setActiveSimulation] = useState<SimulationId>('simulation-1');

  const simulation = useMemo(() => SIMULATION_CONTENT[activeSimulation], [activeSimulation]);

  const handleSimulationChange = (id: SimulationId) => {
    setActiveSimulation(id);
    onSimulationChange?.(id);
  };

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>CASPER - Deployed</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Odaiazol {simulation.title.split(' ')[1]}</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Simulation curation run overview & Key Performance Engagement Report
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleSimulationChange('simulation-1')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: activeSimulation === 'simulation-1' ? 'rgba(34,197,94,0.12)' : 'transparent',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Simulation 1
          </button>
          <button
            onClick={() => handleSimulationChange('simulation-2')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: activeSimulation === 'simulation-2' ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Simulation 2
          </button>
          <button
            onClick={() => handleSimulationChange('simulation-3')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: activeSimulation === 'simulation-3' ? 'rgba(248,113,113,0.12)' : 'transparent',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Simulation 3
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {simulation.heroStats.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{metric.title}</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{metric.value}</div>
              {metric.sublabel && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{metric.sublabel}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {simulation.secondaryStats.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{metric.title}</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {simulation.liftTable.map((entry) => (
          <Card key={entry.label}>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{entry.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 600 }}>{entry.value.toLocaleString()}</div>
              {entry.variants && (
                <div style={{ marginTop: '12px', display: 'grid', gap: '6px' }}>
                  {entry.variants.map((variant) => (
                    <div key={variant.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>{variant.label}</span>
                      <span>{variant.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <CardHeader>
          <CardTitle className="text-xs">Engagement Trajectory</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={simulation.kpiHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-modal)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                <Line type="monotone" dataKey="ca" stroke="#22c55e" strokeWidth={2} dot={{ stroke: '#22c55e', strokeWidth: 2 }} name="CA" />
                <Line type="monotone" dataKey="nca" stroke="#60a5fa" strokeWidth={2} dot={{ stroke: '#60a5fa', strokeWidth: 2 }} name="NCA" />
                <Line type="monotone" dataKey="ncna" stroke="#f97316" strokeWidth={2} dot={{ stroke: '#f97316', strokeWidth: 2 }} name="NCNA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Performance KPIs History</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span>Date</span>
              <span>CA</span>
              <span>NCA</span>
              <span>NCNA</span>
            </div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
              {simulation.kpiHistory.map((row) => (
                <div key={row.date} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', color: 'var(--text-primary)' }}>
                  <span>{row.date}</span>
                  <span>{row.ca}</span>
                  <span>{row.nca}</span>
                  <span>{row.ncna}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Engagement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {simulation.summaryBullets.map((text) => (
                <li key={text} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '6px' }}>
                  <span>{text.split(' – ')[0]}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{text.split(' – ')[1]}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

