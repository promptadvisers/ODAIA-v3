import React from 'react';
import { Badge } from '../Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import type { Simulation } from './SimulationRunner';

interface SimulationResultsProps {
  simulation: Simulation;
  onReview?: () => void;
  onEdit?: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({ simulation, onReview, onEdit }) => {
  // Transform data for grouped bar chart (matching screenshot)
  const chartData = simulation.results?.powerScoreData.map((segment) => ({
    name: segment.segment,
    Current: segment.values[0], // Current configuration
    Simulated: segment.values[segment.values.length - 1] // Simulated configuration
  })) || [];

  return (
    <div style={{
      backgroundColor: '#1a1f2e',
      border: '1px solid #2a3441',
      borderRadius: '12px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0,
            marginBottom: '8px'
          }}>
            {simulation.name}
          </h3>
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '13px',
            color: '#94a3b8'
          }}>
            <span>Established Product: {simulation.config.establishedProduct}</span>
            {simulation.config.parameters.map((param, idx) => (
              <span key={idx}>• {param}</span>
            ))}
          </div>
        </div>
        <Badge variant="warning">in progress</Badge>
      </div>

      {/* PowerScore Chart */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#ffffff',
          marginBottom: '16px'
        }}>
          PowerScore by Segment
        </h4>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0f1419',
                  border: '1px solid #2a3441',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="Current" fill="#5a7fb8" radius={[4, 4, 0, 0]}>
                <LabelList 
                  dataKey="Current" 
                  position="top" 
                  style={{ fill: '#ffffff', fontSize: '12px' }}
                  formatter={(value) => typeof value === 'number' ? value.toFixed(0) : ''}
                />
              </Bar>
              <Bar dataKey="Simulated" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                <LabelList 
                  dataKey="Simulated" 
                  position="top" 
                  style={{ fill: '#ffffff', fontSize: '12px' }}
                  formatter={(value) => typeof value === 'number' ? value.toFixed(0) : ''}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Grid */}
      {simulation.results && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#0f1419',
            borderRadius: '8px',
            border: '1px solid #2a3441'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Current Value
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              {simulation.results.currentValue}
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: '#0f1419',
            borderRadius: '8px',
            border: '1px solid #2a3441'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Potential
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              {simulation.results.potential}
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: '#0f1419',
            borderRadius: '8px',
            border: '1px solid #2a3441'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Competitive Strategy
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              {simulation.results.competitiveStrategy}
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: '#0f1419',
            borderRadius: '8px',
            border: '1px solid #2a3441'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Patient Mix
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              {simulation.results.patientMix}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onReview}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          Review
        </button>
        
        <button
          onClick={onEdit}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            color: '#3b82f6',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#3b82f6';
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};