import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

  // Mock data for basket weight comparison (stacked bars)
  const basketWeightData = [
    { date: '2025-09-16', competitor: 12, precursor: 2, target: 1 }
  ];

  // Mock data for metric weight comparison (stacked bars with legend)
  const metricWeightData = [
    { date: '2025-09-16',
      apidot_claims: 1.5,
      nbrrxxpd_indication: 1.2,
      trx_indication: 0.8,
      apidot_diagnosis: 0.5,
      apidot: 0.3,
      unconditioned_asthma_patie: 0.2
    }
  ];

  // Mock data for basket weight differences table
  const basketDiffTableData = [
    { date: '2025-09-16', basket: 'competitor', original: 2, simulated: 2, diff: 0 },
    { date: '2025-09-16', basket: 'precursor', original: 1, simulated: 1, diff: 0 },
    { date: '2025-09-16', basket: 'target', original: 10, simulated: 10, diff: 0 }
  ];

  // Mock data for metric weight differences table
  const metricDiffTableData = [
    { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'apidot_claims', origWeight: 0.25, simWeight: 0.25, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'nbrrxxpd_indication', origWeight: 1, simWeight: 1, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'competitor', type: 'trx_indication', origWeight: 0.5, simWeight: 0.5, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'apidot_diagnosis', origWeight: 0.5, simWeight: 0.5, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'apidot', origWeight: 1, simWeight: 1, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'precursor', type: 'unconditioned_asthma_pa...', origWeight: 0.99, simWeight: 0.99, diff: 0 },
    { date: '2025-09-16 15:26:11', metric: 'target', type: 'apidot_claims', origWeight: 0.25, simWeight: 0.25, diff: -0.25 },
    { date: '2025-09-16 15:26:11', metric: 'target', type: 'nbrrxxpd_indication', origWeight: 1, simWeight: 1, diff: 0.75 },
    { date: '2025-09-16 15:26:11', metric: 'target', type: 'trx_indication', origWeight: 0.5, simWeight: 0.5, diff: -0.5 }
  ];

  // Mock data for score distribution
  const scoreDistributionData = [
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
  ];

  // Mock data for score difference distribution
  const scoreDiffData = [
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
  ];

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
            <CardContent style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Start Date</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>2025-09-13</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>End Date</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>2025-09-23</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Market Name</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>P3: SPCA (NUCALA)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Top Scored Metric - Original</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>nbrxxpd_indication</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Top Scored Metric - Simulated</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>trx_indication</div>
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
              <CardTitle style={{ fontSize: '13px' }}>Original Basket Weight vs Simulated Basket Weight</CardTitle>
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
              <CardTitle style={{ fontSize: '13px' }}>Basket Weight Diff: Original vs Simulated</CardTitle>
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
                    {basketDiffTableData.map((row, idx) => (
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
              <CardTitle style={{ fontSize: '13px' }}>Original Metric Weight vs Simulated Metric Weight</CardTitle>
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
              <CardTitle style={{ fontSize: '13px' }}>Scoring Metric Weight Diff: Original vs Simulated</CardTitle>
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
                    {metricDiffTableData.map((row, idx) => (
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
              <CardTitle style={{ fontSize: '13px' }}>Score Distribution Count: Original vs Simulated (All Simulated Projects )</CardTitle>
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
              <CardTitle style={{ fontSize: '13px' }}>Score Distribution Summary: Difference</CardTitle>
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
                    {scoreDiffData.map((entry, index) => (
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
