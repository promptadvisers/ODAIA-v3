import React from 'react';
import { Badge } from '../Badge';
import type { Simulation } from './SimulationRunner';

interface SimulationCardProps {
  simulation: Simulation;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation }) => {
  return (
    <div style={{
      backgroundColor: '#1a1f2e',
      border: '1px solid #2a3441',
      borderRadius: '12px',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
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

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: '#0f1419',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div 
          style={{
            height: '100%',
            width: `${simulation.progress}%`,
            backgroundColor: '#3b82f6',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
      </div>

      {/* Status Text */}
      <div style={{
        marginTop: '12px',
        fontSize: '12px',
        color: '#64748b',
        textAlign: 'center'
      }}>
        Running simulation...
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};