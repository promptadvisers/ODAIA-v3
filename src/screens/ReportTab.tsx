import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data repository for different simulation scenarios
const mockDataRepository = {
  'Simulation (Simulation) SPCA NUCALA template - Sept 22 202...': {
    infoCards: {
      startDate: '2025-09-13',
      endDate: '2025-09-23',
      marketName: 'P3: SPCA (NUCALA)',
      topMetricOriginal: 'nbrxxpd_indication',
      topMetricSimulated: 'trx_indication'
    },
    basketWeightData: [
      { date: '2025-09-16', competitor: 12, precursor: 2, target: 1 }
    ],
    metricWeightData: [
      { date: '2025-09-16',
        apidot_claims: 1.5,
        nbrrxxpd_indication: 1.2,
        trx_indication: 0.8,
        apidot_diagnosis: 0.5,
        apidot: 0.3,
        unconditioned_asthma_patie: 0.2
      }
    ],
    basketDiffTable: [
      { date: '2025-09-16', basket: 'competitor', original: 2, simulated: 2, diff: 0 },
      { date: '2025-09-16', basket: 'precursor', original: 1, simulated: 1, diff: 0 },
      { date: '2025-09-16', basket: 'target', original: 10, simulated: 10, diff: 0 }
    ],
    metricDiffTable: [
      { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'apidot_claims', origWeight: 0.25, simWeight: 0.25, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'nbrrxxpd_indication', origWeight: 1, simWeight: 1, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'trx_indication', origWeight: 0.5, simWeight: 0.5, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'apidot_diagnosis', origWeight: 0.5, simWeight: 0.5, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'apidot', origWeight: 1, simWeight: 1, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'unconditioned_asthma_pa...', origWeight: 0.99, simWeight: 0.99, diff: 0 },
      { date: '2025-09-16 15:26:11', metric: 'target', type: 'apidot_claims', origWeight: 0.25, simWeight: 0.25, diff: -0.25 },
      { date: '2025-09-16 15:26:11', metric: 'target', type: 'nbrrxxpd_indication', origWeight: 1, simWeight: 1, diff: 0.75 },
      { date: '2025-09-16 15:26:11', metric: 'target', type: 'trx_indication', origWeight: 0.5, simWeight: 0.5, diff: -0.5 }
    ],
    scoreDistribution: {
      National: [
        { score: '0', original: 10000, simulated: 10000 },
        { score: '1', original: 4000, simulated: 4000 },
        { score: '2', original: 2000, simulated: 2000 },
        { score: '3', original: 1000, simulated: 1000 },
        { score: '4', original: 500, simulated: 500 },
        { score: '5', original: 300, simulated: 300 },
        { score: '6', original: 200, simulated: 200 },
        { score: '7', original: 100, simulated: 100 },
        { score: '8', original: 50, simulated: 50 },
        { score: '9', original: 20, simulated: 20 },
        { score: '10', original: 10, simulated: 10 }
      ],
      Regional: [
        { score: '0', original: 5000, simulated: 5200 },
        { score: '1', original: 2000, simulated: 1900 },
        { score: '2', original: 1000, simulated: 1100 },
        { score: '3', original: 500, simulated: 480 },
        { score: '4', original: 250, simulated: 270 },
        { score: '5', original: 150, simulated: 150 },
        { score: '6', original: 100, simulated: 95 },
        { score: '7', original: 50, simulated: 55 },
        { score: '8', original: 25, simulated: 25 },
        { score: '9', original: 10, simulated: 12 },
        { score: '10', original: 5, simulated: 5 }
      ],
      Territory: [
        { score: '0', original: 2000, simulated: 2100 },
        { score: '1', original: 800, simulated: 750 },
        { score: '2', original: 400, simulated: 450 },
        { score: '3', original: 200, simulated: 190 },
        { score: '4', original: 100, simulated: 110 },
        { score: '5', original: 60, simulated: 60 },
        { score: '6', original: 40, simulated: 38 },
        { score: '7', original: 20, simulated: 22 },
        { score: '8', original: 10, simulated: 10 },
        { score: '9', original: 4, simulated: 5 },
        { score: '10', original: 2, simulated: 2 }
      ]
    },
    scoreDiff: {
      National: [
        { score: '0', diff: 0 },
        { score: '1', diff: 2 },
        { score: '2', diff: -5 },
        { score: '3', diff: 1 },
        { score: '4', diff: 1 },
        { score: '5', diff: 0 },
        { score: '6', diff: -1 },
        { score: '7', diff: 0 },
        { score: '8', diff: 0 },
        { score: '9', diff: 0 },
        { score: '10', diff: 0 }
      ],
      Regional: [
        { score: '0', diff: 200 },
        { score: '1', diff: -100 },
        { score: '2', diff: 100 },
        { score: '3', diff: -20 },
        { score: '4', diff: 20 },
        { score: '5', diff: 0 },
        { score: '6', diff: -5 },
        { score: '7', diff: 5 },
        { score: '8', diff: 0 },
        { score: '9', diff: 2 },
        { score: '10', diff: 0 }
      ],
      Territory: [
        { score: '0', diff: 100 },
        { score: '1', diff: -50 },
        { score: '2', diff: 50 },
        { score: '3', diff: -10 },
        { score: '4', diff: 10 },
        { score: '5', diff: 0 },
        { score: '6', diff: -2 },
        { score: '7', diff: 2 },
        { score: '8', diff: 0 },
        { score: '9', diff: 1 },
        { score: '10', diff: 0 }
      ]
    }
  },
  'Value Engine: HCP Targeting v2.1': {
    infoCards: {
      startDate: '2025-08-01',
      endDate: '2025-08-15',
      marketName: 'US Market - Oncology',
      topMetricOriginal: 'trx_volume',
      topMetricSimulated: 'nbrx_volume'
    },
    basketWeightData: [
      { date: '2025-08-01', competitor: 8, precursor: 5, target: 3 }
    ],
    metricWeightData: [
      { date: '2025-08-01',
        apidot_claims: 1.8,
        nbrrxxpd_indication: 0.9,
        trx_indication: 1.1,
        apidot_diagnosis: 0.7,
        apidot: 0.4,
        unconditioned_asthma_patie: 0.3
      }
    ],
    basketDiffTable: [
      { date: '2025-08-01', basket: 'competitor', original: 8, simulated: 9, diff: 1 },
      { date: '2025-08-01', basket: 'precursor', original: 5, simulated: 4, diff: -1 },
      { date: '2025-08-01', basket: 'target', original: 3, simulated: 5, diff: 2 }
    ],
    metricDiffTable: [
      { date: '2025-08-01 10:15:22', metric: 'competitor', type: 'apidot_claims', origWeight: 0.5, simWeight: 0.6, diff: 0.1 },
      { date: '2025-08-01 10:15:22', metric: 'competitor', type: 'nbrrxxpd_indication', origWeight: 0.8, simWeight: 0.9, diff: 0.1 },
      { date: '2025-08-01 10:15:22', metric: 'competitor', type: 'trx_indication', origWeight: 0.7, simWeight: 0.6, diff: -0.1 },
      { date: '2025-08-01 10:15:22', metric: 'precursor', type: 'apidot_diagnosis', origWeight: 0.6, simWeight: 0.7, diff: 0.1 },
      { date: '2025-08-01 10:15:22', metric: 'precursor', type: 'apidot', origWeight: 0.9, simWeight: 0.8, diff: -0.1 },
      { date: '2025-08-01 10:15:22', metric: 'precursor', type: 'unconditioned_asthma_pa...', origWeight: 0.75, simWeight: 0.85, diff: 0.1 },
      { date: '2025-08-01 10:15:22', metric: 'target', type: 'apidot_claims', origWeight: 0.4, simWeight: 0.5, diff: 0.1 },
      { date: '2025-08-01 10:15:22', metric: 'target', type: 'nbrrxxpd_indication', origWeight: 0.9, simWeight: 1.2, diff: 0.3 },
      { date: '2025-08-01 10:15:22', metric: 'target', type: 'trx_indication', origWeight: 0.6, simWeight: 0.4, diff: -0.2 }
    ],
    scoreDistribution: {
      National: [
        { score: '0', original: 8000, simulated: 8500 },
        { score: '1', original: 3500, simulated: 3200 },
        { score: '2', original: 1800, simulated: 2000 },
        { score: '3', original: 900, simulated: 850 },
        { score: '4', original: 450, simulated: 500 },
        { score: '5', original: 280, simulated: 290 },
        { score: '6', original: 180, simulated: 170 },
        { score: '7', original: 90, simulated: 95 },
        { score: '8', original: 45, simulated: 48 },
        { score: '9', original: 18, simulated: 20 },
        { score: '10', original: 9, simulated: 10 }
      ],
      Regional: [
        { score: '0', original: 4000, simulated: 4250 },
        { score: '1', original: 1750, simulated: 1600 },
        { score: '2', original: 900, simulated: 1000 },
        { score: '3', original: 450, simulated: 425 },
        { score: '4', original: 225, simulated: 250 },
        { score: '5', original: 140, simulated: 145 },
        { score: '6', original: 90, simulated: 85 },
        { score: '7', original: 45, simulated: 48 },
        { score: '8', original: 23, simulated: 24 },
        { score: '9', original: 9, simulated: 10 },
        { score: '10', original: 5, simulated: 5 }
      ],
      Territory: [
        { score: '0', original: 1600, simulated: 1700 },
        { score: '1', original: 700, simulated: 640 },
        { score: '2', original: 360, simulated: 400 },
        { score: '3', original: 180, simulated: 170 },
        { score: '4', original: 90, simulated: 100 },
        { score: '5', original: 56, simulated: 58 },
        { score: '6', original: 36, simulated: 34 },
        { score: '7', original: 18, simulated: 19 },
        { score: '8', original: 9, simulated: 10 },
        { score: '9', original: 4, simulated: 4 },
        { score: '10', original: 2, simulated: 2 }
      ]
    },
    scoreDiff: {
      National: [
        { score: '0', diff: 500 },
        { score: '1', diff: -300 },
        { score: '2', diff: 200 },
        { score: '3', diff: -50 },
        { score: '4', diff: 50 },
        { score: '5', diff: 10 },
        { score: '6', diff: -10 },
        { score: '7', diff: 5 },
        { score: '8', diff: 3 },
        { score: '9', diff: 2 },
        { score: '10', diff: 1 }
      ],
      Regional: [
        { score: '0', diff: 250 },
        { score: '1', diff: -150 },
        { score: '2', diff: 100 },
        { score: '3', diff: -25 },
        { score: '4', diff: 25 },
        { score: '5', diff: 5 },
        { score: '6', diff: -5 },
        { score: '7', diff: 3 },
        { score: '8', diff: 1 },
        { score: '9', diff: 1 },
        { score: '10', diff: 0 }
      ],
      Territory: [
        { score: '0', diff: 100 },
        { score: '1', diff: -60 },
        { score: '2', diff: 40 },
        { score: '3', diff: -10 },
        { score: '4', diff: 10 },
        { score: '5', diff: 2 },
        { score: '6', diff: -2 },
        { score: '7', diff: 1 },
        { score: '8', diff: 1 },
        { score: '9', diff: 0 },
        { score: '10', diff: 0 }
      ]
    }
  }
};

export const ReportTab: React.FC = () => {
  // Control Panel state
  const [selectedClientDB, setSelectedClientDB] = useState('p3s_globcubes_curated');
  const [selectedClientName, setSelectedClientName] = useState('p3kesimDd');
  const [selectedMarket, setSelectedMarket] = useState('P3: SPCA (NUCALA)');
  const [selectedDateRange, setSelectedDateRange] = useState('09/23/2025 - 09/23/2025');
  const [selectedSimulation, setSelectedSimulation] = useState('Simulation (Simulation) SPCA NUCALA template - Sept 22 202...');
  const [selectedProject, setSelectedProject] = useState('SPCA NUCALA (Sep 16, 2025)');
  const [selectedObjective, setSelectedObjective] = useState('NUCALA SA vs COMPETITIVE SA - FASENRA');
  const [selectedRegion, setSelectedRegion] = useState('National');

  // Compute current data based on filter selections
  const currentData = useMemo(() => {
    // Get data for selected simulation, or fallback to first available
    const dataKey = selectedSimulation as keyof typeof mockDataRepository;
    console.log('Selected Client DB:', selectedClientDB);
    console.log('Selected Client Name:', selectedClientName);
    console.log('Selected Simulation:', selectedSimulation);
    console.log('Selected Market:', selectedMarket);
    console.log('Selected Project:', selectedProject);
    console.log('Selected Objective:', selectedObjective);
    console.log('Selected Date Range:', selectedDateRange);
    console.log('Current Data Key:', dataKey);

    const baseData = mockDataRepository[dataKey] || mockDataRepository['Simulation (Simulation) SPCA NUCALA template - Sept 22 202...'];

    // Apply filter-specific variations
    let data = JSON.parse(JSON.stringify(baseData)); // Deep clone

    // Parse date range (format: "MM/DD/YYYY - MM/DD/YYYY")
    const dateRangeParts = selectedDateRange.split(' - ');
    if (dateRangeParts.length === 2) {
      const [startDateStr, endDateStr] = dateRangeParts;
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const parseDate = (dateStr: string) => {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };
      data.infoCards.startDate = parseDate(startDateStr);
      data.infoCards.endDate = parseDate(endDateStr);
    }

    // Client DB variations - affects data scale
    const dbMultiplier = selectedClientDB.includes('globcubes') ? 1.0 : 1.5;

    // Client Name variations - affects competitive balance
    const clientMultiplier = selectedClientName === 'acme_pharma' ? 1.3 : 1.0;

    // Modify data based on market selection
    if (selectedMarket !== baseData.infoCards.marketName) {
      data.infoCards.marketName = selectedMarket;
      data.basketWeightData = data.basketWeightData.map((d: any) => ({
        ...d,
        competitor: Math.round(d.competitor * (selectedMarket.includes('Oncology') ? 0.8 : 1.2) * dbMultiplier * clientMultiplier),
        precursor: Math.round(d.precursor * (selectedMarket.includes('Oncology') ? 1.3 : 0.9) * dbMultiplier * clientMultiplier),
        target: Math.round(d.target * (selectedMarket.includes('Oncology') ? 1.5 : 0.8) * dbMultiplier * clientMultiplier)
      }));
    } else {
      // Apply DB and client multipliers even if market matches
      data.basketWeightData = data.basketWeightData.map((d: any) => ({
        ...d,
        competitor: Math.round(d.competitor * dbMultiplier * clientMultiplier),
        precursor: Math.round(d.precursor * dbMultiplier * clientMultiplier),
        target: Math.round(d.target * dbMultiplier * clientMultiplier)
      }));
    }

    // Project Name variations - affects metric emphasis
    const projectMultiplier = selectedProject.includes('Odaiazol') ? 1.15 : 1.0;

    // Modify data based on objective selection
    const isTargeting = selectedObjective.includes('Targeting');
    data.metricWeightData = data.metricWeightData.map((d: any) => ({
      ...d,
      apidot_claims: d.apidot_claims * (isTargeting ? 1.2 : 1.0) * projectMultiplier,
      nbrrxxpd_indication: d.nbrrxxpd_indication * (isTargeting ? 0.9 : 1.0) * projectMultiplier,
      trx_indication: d.trx_indication * (isTargeting ? 1.1 : 1.0) * projectMultiplier,
      apidot_diagnosis: d.apidot_diagnosis * projectMultiplier,
      apidot: d.apidot * projectMultiplier,
      unconditioned_asthma_patie: d.unconditioned_asthma_patie * projectMultiplier
    }));

    // Update basket diff table
    data.basketDiffTable = data.basketDiffTable.map((row: any) => ({
      ...row,
      original: Math.round(row.original * dbMultiplier * clientMultiplier),
      simulated: Math.round(row.simulated * dbMultiplier * clientMultiplier * (isTargeting ? 1.1 : 1.0)),
      diff: Math.round(row.simulated * dbMultiplier * clientMultiplier * (isTargeting ? 1.1 : 1.0)) - Math.round(row.original * dbMultiplier * clientMultiplier)
    }));

    // Update metric diff table
    data.metricDiffTable = data.metricDiffTable.map((row: any) => ({
      ...row,
      origWeight: parseFloat((row.origWeight * projectMultiplier).toFixed(2)),
      simWeight: parseFloat((row.simWeight * projectMultiplier * (isTargeting ? 1.05 : 1.0)).toFixed(2)),
      diff: parseFloat((row.simWeight * projectMultiplier * (isTargeting ? 1.05 : 1.0) - row.origWeight * projectMultiplier).toFixed(2))
    }));

    // Update score distributions based on all filters
    const scoreMultiplier = dbMultiplier * clientMultiplier;
    Object.keys(data.scoreDistribution).forEach((region: string) => {
      data.scoreDistribution[region] = data.scoreDistribution[region].map((item: any) => ({
        ...item,
        original: Math.round(item.original * scoreMultiplier),
        simulated: Math.round(item.simulated * scoreMultiplier * (isTargeting ? 1.02 : 1.0))
      }));
    });

    // Update score diffs
    Object.keys(data.scoreDiff).forEach((region: string) => {
      data.scoreDiff[region] = data.scoreDiff[region].map((item: any, idx: number) => {
        const originalVal = data.scoreDistribution[region][idx].original;
        const simulatedVal = data.scoreDistribution[region][idx].simulated;
        return {
          ...item,
          diff: simulatedVal - originalVal
        };
      });
    });

    console.log('Loaded Data:', data.infoCards);
    return data;
  }, [selectedSimulation, selectedMarket, selectedProject, selectedObjective, selectedDateRange, selectedClientDB, selectedClientName]);

  // Extract reactive data from current simulation
  const infoCards = useMemo(() => currentData.infoCards, [currentData]);
  const basketWeightData = useMemo(() => currentData.basketWeightData, [currentData]);
  const metricWeightData = useMemo(() => currentData.metricWeightData, [currentData]);
  const basketDiffTableData = useMemo(() => currentData.basketDiffTable, [currentData]);
  const metricDiffTableData = useMemo(() => currentData.metricDiffTable, [currentData]);

  // Score distribution data based on selected region
  const scoreDistributionData = useMemo(() => {
    const regionKey = selectedRegion as keyof typeof currentData.scoreDistribution;
    console.log('Selected Region:', selectedRegion);
    console.log('Score Distribution for', regionKey, ':', currentData.scoreDistribution[regionKey]);
    return currentData.scoreDistribution[regionKey] || currentData.scoreDistribution.National;
  }, [currentData, selectedRegion]);

  const scoreDiffData = useMemo(() => {
    const regionKey = selectedRegion as keyof typeof currentData.scoreDiff;
    return currentData.scoreDiff[regionKey] || currentData.scoreDiff.National;
  }, [currentData, selectedRegion]);

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'var(--bg-main)' }}>
      {/* Control Panel Sidebar */}
      <div style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '20px 16px',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '20px',
          letterSpacing: '-0.01em'
        }}>
          Control Panel
        </h2>

        {/* General Settings Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <Settings size={14} color="var(--accent-yellow)" />
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0
            }}>
              General Settings
            </h3>
          </div>

          {/* Client DB Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Client DB *
            </label>
            <select
              value={selectedClientDB}
              onChange={(e) => setSelectedClientDB(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="p3s_globcubes_curated">p3s_globcubes_curated</option>
              <option value="iqvia_onekey">IQVIA OneKey</option>
              <option value="komodo_health">Komodo Health</option>
            </select>
          </div>

          {/* Client Name Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Client Name *
            </label>
            <select
              value={selectedClientName}
              onChange={(e) => setSelectedClientName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="p3kesimDd">p3kesimDd</option>
              <option value="acme_pharma">Acme Pharma</option>
            </select>
          </div>

          {/* Market Name Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Market Name *
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="P3: SPCA (NUCALA)">P3: SPCA (NUCALA)</option>
              <option value="US Market - Oncology">US Market - Oncology</option>
            </select>
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Date Range *
            </label>
            <input
              type="text"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>

          {/* Simulation Name Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Simulation Name *
            </label>
            <select
              value={selectedSimulation}
              onChange={(e) => setSelectedSimulation(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="Simulation (Simulation) SPCA NUCALA template - Sept 22 202...">Simulation (Simulation) SPCA NUCALA template - Sept 22 202...</option>
              <option value="Value Engine: HCP Targeting v2.1">Value Engine: HCP Targeting v2.1</option>
            </select>
          </div>

          {/* Project Name Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Project Name *
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="SPCA NUCALA (Sep 16, 2025)">SPCA NUCALA (Sep 16, 2025)</option>
              <option value="Odaiazol Project">Odaiazol Project</option>
            </select>
          </div>

          {/* Objective Name Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Objective Name *
            </label>
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="NUCALA SA vs COMPETITIVE SA - FASENRA">NUCALA SA vs COMPETITIVE SA - FASENRA</option>
              <option value="HCP Targeting Objective">HCP Targeting Objective</option>
            </select>
          </div>
        </div>

        {/* Dashboard Config Section */}
        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px'
          }}>
            Dashboard Config
          </h3>

          {/* Simulated Regions Dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}>
              Simulated Regions
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="National">National</option>
              <option value="Regional">Regional</option>
              <option value="Territory">Territory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
        {/* Page Title */}
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '20px',
          letterSpacing: '-0.01em'
        }}>
          PowerScore Simulation Comparison
        </h1>

        {/* Info Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <Card>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Start Date</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{infoCards.startDate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>End Date</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{infoCards.endDate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Market Name</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{infoCards.marketName}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Top Scored Metric - Original</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{infoCards.topMetricOriginal}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Top Scored Metric - Simulated</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{infoCards.topMetricSimulated}</div>
            </CardContent>
          </Card>
        </div>

        {/* Section Title */}
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          marginTop: '24px',
          letterSpacing: '-0.01em'
        }}>
          Original vs Simulation
        </h2>

        {/* Chart Grid - Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Basket Weight Stacked Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Original Basket Weight vs Simulated Basket Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={basketWeightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-modal)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="competitor" stackId="a" fill="#60a5fa" name="competitor" />
                  <Bar dataKey="precursor" stackId="a" fill="#93c5fd" name="precursor" />
                  <Bar dataKey="target" stackId="a" fill="#bfdbfe" name="target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Basket Weight Diff Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Basket Weight Diff: Original vs Simulated</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Day of Created At</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Basket</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Original Basket Weight</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Simulated Basket Weight</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Weight Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basketDiffTableData.map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.date}</td>
                        <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{row.basket}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{row.original}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-primary)' }}>{row.simulated}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'right',
                          color: row.diff === 0 ? 'var(--text-secondary)' : row.diff > 0 ? '#fff' : '#fff',
                          backgroundColor: row.diff === 0 ? 'transparent' : row.diff > 0 ? '#10b981' : '#ef4444',
                          fontWeight: '500'
                        }}>
                          {row.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>3 rows × 5 columns</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Grid - Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Metric Weight Stacked Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Original Metric Weight vs Simulated Metric Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={metricWeightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-modal)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="apidot_claims" stackId="a" fill="#60a5fa" name="apidot_claims" />
                  <Bar dataKey="nbrrxxpd_indication" stackId="a" fill="#3b82f6" name="nbrrxxpd_indication" />
                  <Bar dataKey="trx_indication" stackId="a" fill="#2563eb" name="trx_indication" />
                  <Bar dataKey="apidot_diagnosis" stackId="a" fill="#ef4444" name="apidot_diagnosis" />
                  <Bar dataKey="apidot" stackId="a" fill="#f59e0b" name="apidot" />
                  <Bar dataKey="unconditioned_asthma_patie" stackId="a" fill="#f97316" name="unconditioned_asthma_patie..." />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Metric Weight Diff Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Scoring Metric Weight Diff: Original vs Simulated</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto', maxHeight: '280px' }}>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-card)' }}>
                    <tr style={{ backgroundColor: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Created At</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Basket</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Metric Type</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Original Metric Weight</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Simulated Metric Weight</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Weight Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricDiffTableData.map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '10px' }}>{row.date}</td>
                        <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{row.metric}</td>
                        <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{row.type}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{row.origWeight}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-primary)' }}>{row.simWeight}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'right',
                          color: row.diff === 0 ? 'var(--text-secondary)' : '#fff',
                          backgroundColor: row.diff === 0 ? 'transparent' : row.diff > 0 ? '#10b981' : row.diff < -0.2 ? '#ef4444' : '#f59e0b',
                          fontWeight: '500'
                        }}>
                          {row.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>9 rows × 6 columns</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Grid - Row 3 (Score Distribution) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Score Distribution Count Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Score Distribution Count: Original vs Simulated (All Simulated Projects )</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="score" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-modal)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="original" fill="#60a5fa" name="Original Powerscores Count" />
                  <Bar dataKey="simulated" fill="#f87171" name="Simulated Powerscores Cou..." />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution Summary (Difference) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Score Distribution Summary: Difference</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreDiffData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="score" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[-5, 5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-modal)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="diff" name="Score Difference">
                    {scoreDiffData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.diff >= 0 ? '#60a5fa' : '#60a5fa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
