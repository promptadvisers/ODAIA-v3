import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface InfoCards {
  startDate: string;
  endDate: string;
  marketName: string;
  topMetricOriginal: string;
  topMetricSimulated: string;
}

interface BasketWeightDatum {
  date: string;
  competitor: number;
  precursor: number;
  target: number;
}

type MetricWeightDatum = {
  date: string;
} & Record<string, number>;

interface BasketDiffRow {
  date: string;
  basket: string;
  original: number;
  simulated: number;
  diff: number;
}

interface MetricDiffRow {
  date: string;
  metric: string;
  type: string;
  origWeight: number;
  simWeight: number;
  diff: number;
}

interface InflowOutflowRow {
  score: string;
  inflow: number;
  outflow: number;
}

interface MembershipChangeRow {
  entityId: string;
  original: number;
  simulated: number;
  scoreDiff: number;
}

interface PowerScoreSimulationViewProps {
  infoCards: InfoCards;
  basketWeightData: BasketWeightDatum[];
  metricWeightData: MetricWeightDatum[];
  basketDiffTableData: BasketDiffRow[];
  metricDiffTableData: MetricDiffRow[];
  inflowOutflowData: InflowOutflowRow[];
  membershipChangeData: MembershipChangeRow[];
}

export const PowerScoreSimulationView: React.FC<PowerScoreSimulationViewProps> = ({
  infoCards,
  basketWeightData,
  metricWeightData,
  basketDiffTableData,
  metricDiffTableData,
  inflowOutflowData,
  membershipChangeData
}) => {
  return (
    <>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                  {basketDiffTableData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.date}</td>
                      <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{row.basket}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{row.original}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-primary)' }}>{row.simulated}</td>
                      <td style={{
                        padding: '8px',
                        textAlign: 'right',
                        color: row.diff === 0 ? 'var(--text-secondary)' : '#fff',
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                <Bar dataKey="apidot" stackId="a" fill="#6366f1" name="apidot" />
                <Bar dataKey="unconditioned_asthma_patie" stackId="a" fill="#f97316" name="unconditioned_asthma_patie..." />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
            <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>9 rows × 6 columns</div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Inflow & Outflow</CardTitle>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Simulation = Original + Inflow - Outflow
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={inflowOutflowData}>
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
                <Bar dataKey="inflow" fill="#60a5fa" name="Inflow" label={{ position: 'inside', fill: '#000', fontSize: 11 }} />
                <Bar dataKey="outflow" fill="#f87171" name="Outflow" label={{ position: 'inside', fill: '#000', fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Change In Membership</CardTitle>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Entities with +/- Score Difference
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '280px' }}>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-card)' }}>
                  <tr style={{ backgroundColor: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Day of Created At</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Entity ID</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>ORIGINAL_VALUE</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>SIMULATED_VALUE</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '10px' }}>Score Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipChangeData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '10px' }}>2025-09-16</td>
                      <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{row.entityId}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{row.original}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-primary)' }}>{row.simulated}</td>
                      <td style={{
                        padding: '8px',
                        textAlign: 'right',
                        color: '#fff',
                        backgroundColor: row.scoreDiff > 0 ? '#10b981' : '#ef4444',
                        fontWeight: '500'
                      }}>
                        {row.scoreDiff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>{membershipChangeData.length} rows × 5 columns</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

