import React from 'react';

export interface SuggestionCardData {
  id: string;
  title: string;
  description?: string;
  action: () => void;
  visible: boolean;
}

interface SuggestionCardProps {
  card: SuggestionCardData;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ card }) => {
  if (!card.visible) return null;

  return (
    <div
      onClick={card.action}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 14px',
        cursor: 'pointer',
        transition: 'all 200ms',
        display: 'flex',
        alignItems: 'center',
        animation: 'slideIn 0.3s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      }}
    >
      {/* Title only - no description, no dot */}
      <span style={{
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        lineHeight: '1.4'
      }}>
        {card.title}
      </span>

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
