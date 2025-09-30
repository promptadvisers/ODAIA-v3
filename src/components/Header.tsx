import React from 'react';
import { cn } from '../lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface HeaderProps {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <header 
      style={{ 
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ padding: '16px 24px' }}>
        {tabs && tabs.length > 0 && (
          <nav style={{ display: 'flex', gap: '32px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  'relative transition-colors duration-200'
                )}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  paddingBottom: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span 
                    style={{ 
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--accent-blue)'
                    }} 
                  />
                )}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};