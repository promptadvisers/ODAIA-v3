import React from 'react';
import { Info } from 'lucide-react';

interface Metric {
  name: string;
  weight: number;
  visualize: boolean;
}

interface MetricsTableProps {
  metrics: Metric[];
  setMetrics: (metrics: Metric[]) => void;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ metrics, setMetrics }) => {
  const updateMetricWeight = (index: number, weight: string) => {
    const newMetrics = [...metrics];
    newMetrics[index].weight = parseInt(weight) || 0;
    setMetrics(newMetrics);
  };

  const toggleVisualize = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics[index].visualize = !newMetrics[index].visualize;
    setMetrics(newMetrics);
  };

  return (
    <div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '8px'
      }}>
        Metrics
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '16px'
      }}>
        Assign scoring weight for each available metric
      </p>

      <div style={{
        backgroundColor: '#0f1419',
        border: '1px solid #2a3441',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 150px 100px',
          padding: '12px 16px',
          borderBottom: '1px solid #2a3441',
          backgroundColor: '#1a1f2e'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '500'
          }}>
            Metric name
          </div>
          <div style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '500'
          }}>
            Scoring weight
          </div>
          <div style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Visualize
            <Info size={14} style={{ color: '#64748b' }} />
          </div>
        </div>

        {/* Table Rows */}
        {metrics.map((metric, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 150px 100px',
              padding: '12px 16px',
              borderBottom: index < metrics.length - 1 ? '1px solid #2a3441' : 'none',
              alignItems: 'center'
            }}
          >
            <div style={{
              fontSize: '14px',
              color: '#ffffff'
            }}>
              {metric.name}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={`${metric.weight}%`}
                onChange={(e) => {
                  const value = e.target.value.replace('%', '');
                  updateMetricWeight(index, value);
                }}
                style={{
                  width: '100px',
                  padding: '6px 8px',
                  backgroundColor: '#0f1419',
                  border: '1px solid #2a3441',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              />
              {/* Underline for non-zero values */}
              {metric.weight > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  height: '1px',
                  backgroundColor: '#3b82f6'
                }} />
              )}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <input
                type="checkbox"
                checked={metric.visualize}
                onChange={() => toggleVisualize(index)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#3b82f6'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};