import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BasketSectionProps {
  title: string;
  children?: React.ReactNode;
}

export const BasketSection: React.FC<BasketSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      marginTop: '16px',
      backgroundColor: '#0f1419',
      border: '1px solid #2a3441',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#1a1f2e',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#252b3b';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1f2e';
        }}
      >
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#ffffff'
        }}>
          {title}
        </span>
        <span style={{ color: '#64748b' }}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      
      {isExpanded && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #2a3441'
        }}>
          {children || (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '14px'
            }}>
              No items configured for this basket
            </div>
          )}
        </div>
      )}
    </div>
  );
};