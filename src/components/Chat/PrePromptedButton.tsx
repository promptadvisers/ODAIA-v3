import React from 'react';
import type { PrePrompt } from '../../store/chatStore';

interface PrePromptedButtonProps {
  prompt: PrePrompt;
}

export const PrePromptedButton: React.FC<PrePromptedButtonProps> = ({ prompt }) => {
  if (!prompt.visible) return null;
  
  return (
    <div style={{
      animation: 'slideIn 0.3s ease-out',
      marginBottom: '8px'
    }}>
      <button
        onClick={prompt.action}
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '10px 14px',
          backgroundColor: 'transparent',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          fontSize: '13px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 200ms',
          display: 'block',
          position: 'relative',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.15)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.15)';
        }}
      >
        <span>{prompt.text}</span>
      </button>
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};