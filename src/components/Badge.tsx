import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'var(--accent-green)',
          color: 'white',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: '600'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--accent-yellow)',
          color: 'white',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: '600'
        };
      case 'info':
        return {
          backgroundColor: 'var(--accent-blue)',
          color: 'white',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      default:
        return {
          backgroundColor: 'var(--border-primary)',
          color: 'var(--text-secondary)',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '500'
        };
    }
  };

  return (
    <span
      className={cn('inline-flex items-center', className)}
      style={{
        ...getVariantStyles(),
        borderRadius: '6px',
        textTransform: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
};