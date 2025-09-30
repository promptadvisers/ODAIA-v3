import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface TotalMarketTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TotalMarketTreeModal: React.FC<TotalMarketTreeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['total-market', 'respiratory']));

  if (!isOpen) return null;

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#1a1f2e',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#1a2332',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#ffffff',
            margin: 0
          }}>
            Total Market Product Tree
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tree Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: '20px'
        }}>
          {/* TOTAL MARKET */}
          <div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: expandedNodes.has('total-market') ? '#2a3441' : 'transparent',
                borderRadius: '6px',
                marginBottom: '4px'
              }}
              onClick={() => toggleNode('total-market')}
            >
              {expandedNodes.has('total-market') ? 
                <ChevronDown size={18} style={{ color: '#64748b', marginRight: '12px' }} /> :
                <ChevronUp size={18} style={{ color: '#64748b', marginRight: '12px' }} />
              }
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                TOTAL MARKET
              </span>
            </div>

            {/* TOTAL RESPIRATORY MARKET */}
            {expandedNodes.has('total-market') && (
              <div style={{ paddingLeft: '24px' }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    cursor: 'pointer',
                    backgroundColor: expandedNodes.has('respiratory') ? '#2a3441' : 'transparent',
                    borderRadius: '6px',
                    marginBottom: '4px'
                  }}
                  onClick={() => toggleNode('respiratory')}
                >
                  {expandedNodes.has('respiratory') ? 
                    <ChevronDown size={18} style={{ color: '#64748b', marginRight: '12px' }} /> :
                    <ChevronUp size={18} style={{ color: '#64748b', marginRight: '12px' }} />
                  }
                  <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                    TOTAL RESPIRATORY MARKET
                  </span>
                </div>

                {/* Respiratory Sub-items */}
                {expandedNodes.has('respiratory') && (
                  <div style={{ paddingLeft: '36px' }}>
                    {[
                      'ICS LABA',
                      'ICS',
                      'LABA',
                      'LABA/LAMA',
                      'LAMA',
                      'TRIPLE - SITT',
                      'SAMA',
                      'BIOLOGIC'
                    ].map((item, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2a3441';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <ChevronUp size={18} style={{ visibility: 'hidden', marginRight: '12px' }} />
                        <span style={{ color: '#ffffff', fontSize: '14px' }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #2a3441',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};