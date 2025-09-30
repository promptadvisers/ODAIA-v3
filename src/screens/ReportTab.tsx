import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ReportTab: React.FC = () => {
  const { setActiveModal } = useAppStore();
  const [simulations, setSimulations] = useState([
    { id: 1, name: 'Value Engine: HCP Targeting Option 1', status: 'running', progress: 0, completed: false },
    { id: 2, name: 'Value Engine: HCP Targeting Option 2', status: 'running', progress: 0, completed: false }
  ]);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulations(prev => prev.map(sim => {
        if (!sim.completed && sim.progress < 100) {
          const newProgress = Math.min(sim.progress + 10, 100);
          return {
            ...sim,
            progress: newProgress,
            completed: newProgress === 100,
            status: newProgress === 100 ? 'completed' : 'running'
          };
        }
        return sim;
      }));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Mock data for PowerScore by Segment chart
  const chartData = [
    { segment: '1', A: 15, B: 10 },
    { segment: '2', A: 18, B: 14 },
    { segment: '3', A: 25, B: 20 },
    { segment: '4', A: 30, B: 22 },
    { segment: '5', A: 28, B: 18 },
    { segment: '6', A: 40, B: 35 },
    { segment: '7', A: 22, B: 18 },
    { segment: '8', A: 18, B: 15 },
    { segment: '9', A: 12, B: 10 },
    { segment: '10', A: 8, B: 6 }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
        {simulations.map((sim) => (
          <Card key={sim.id}>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <CardTitle>{sim.name}</CardTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      Established Product
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      70/30 Value Weighting
                    </span>
                    {sim.id === 2 && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--border-primary)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '500',
                        borderRadius: '4px'
                      }}>
                        XPO TRx Weight to 0.2
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={sim.completed ? 'success' : 'warning'}>
                  {sim.completed ? 'Completed' : 'in progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!sim.completed ? (
                <div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--border-primary)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: `${sim.progress}%`,
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center'
                  }}>
                    Running simulation
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      PowerScore by Segment
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                        <XAxis
                          dataKey="segment"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                        />
                        <YAxis
                          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                        />
                        <Bar dataKey="A" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="B" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setActiveModal('simulation-report')}
                    style={{ width: '100%' }}
                  >
                    Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
