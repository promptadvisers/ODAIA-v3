import React from 'react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, Target, DollarSign } from 'lucide-react';

const performanceData = [
  { month: 'Jan', actual: 4000, target: 3800, lastYear: 3200 },
  { month: 'Feb', actual: 4200, target: 4000, lastYear: 3400 },
  { month: 'Mar', actual: 4500, target: 4200, lastYear: 3600 },
  { month: 'Apr', actual: 4800, target: 4500, lastYear: 3800 },
  { month: 'May', actual: 5200, target: 4800, lastYear: 4000 },
  { month: 'Jun', actual: 5500, target: 5000, lastYear: 4200 }
];

const marketShareData = [
  { name: 'Odaiazol', value: 35, color: 'var(--accent-blue)' },
  { name: 'Competitor A', value: 25, color: 'var(--accent-green)' },
  { name: 'Competitor B', value: 20, color: 'var(--accent-yellow)' },
  { name: 'Others', value: 20, color: 'var(--text-muted)' }
];

const hcpEngagementData = [
  { week: 'W1', calls: 120, emails: 80, meetings: 45 },
  { week: 'W2', calls: 135, emails: 92, meetings: 52 },
  { week: 'W3', calls: 142, emails: 88, meetings: 48 },
  { week: 'W4', calls: 138, emails: 95, meetings: 55 }
];

const kpiCards = [
  {
    title: 'Total Revenue',
    value: '$5.2M',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
    color: 'var(--accent-green)'
  },
  {
    title: 'Market Share',
    value: '35%',
    change: '+3%',
    trend: 'up',
    icon: Target,
    color: 'var(--accent-blue)'
  },
  {
    title: 'HCP Reach',
    value: '2,847',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'var(--accent-teal)'
  },
  {
    title: 'Script Volume',
    value: '14.2K',
    change: '-2%',
    trend: 'down',
    icon: Activity,
    color: 'var(--accent-yellow)'
  }
];

export const LiveAnalytics: React.FC = () => {
  return (
    <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', overflow: 'auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Live Analytics Dashboard
          </h2>
          <p style={{ 
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            Real-time performance metrics and insights
          </p>
        </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {kpiCards.map((kpi, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  {kpi.title}
                </p>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {kpi.value}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '8px'
                }}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp style={{ width: '14px', height: '14px', color: 'var(--accent-green)' }} />
                  ) : (
                    <TrendingDown style={{ width: '14px', height: '14px', color: 'var(--accent-yellow)' }} />
                  )}
                  <span style={{
                    fontSize: '12px',
                    color: kpi.trend === 'up' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    fontWeight: '500'
                  }}>
                    {kpi.change}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}>
                    vs last month
                  </span>
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: kpi.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <kpi.icon style={{ width: '20px', height: '20px', color: kpi.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Performance Trend */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Revenue Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
              <YAxis stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="actual" stroke="var(--accent-blue)" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="var(--accent-green)" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="lastYear" stroke="var(--text-muted)" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Share */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Market Share Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* HCP Engagement */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            HCP Engagement Metrics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hcpEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="week" stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
              <YAxis stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="calls" fill="var(--accent-blue)" />
              <Bar dataKey="emails" fill="var(--accent-green)" />
              <Bar dataKey="meetings" fill="var(--accent-yellow)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Territory Performance */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Territory Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Northeast', 'Southeast', 'Midwest', 'West Coast'].map((territory, index) => {
              const performance = 60 + Math.random() * 40;
              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {territory}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {performance.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${performance}%`,
                      backgroundColor: performance > 80 ? 'var(--accent-green)' : 
                                      performance > 60 ? 'var(--accent-blue)' : 
                                      'var(--accent-yellow)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div style={{
        marginTop: '24px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        padding: '20px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { time: '2 hours ago', event: 'New HCP target list generated for Q4', type: 'info' },
            { time: '5 hours ago', event: 'Sales goal achieved: Northeast territory reached 105% of target', type: 'success' },
            { time: '1 day ago', event: 'Brand access strategy approved by medical affairs', type: 'success' },
            { time: '2 days ago', event: 'Competitive analysis report available for review', type: 'warning' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '6px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                marginTop: '4px',
                backgroundColor: activity.type === 'success' ? 'var(--accent-green)' :
                                activity.type === 'warning' ? 'var(--accent-yellow)' :
                                'var(--accent-blue)'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {activity.event}
                </p>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};