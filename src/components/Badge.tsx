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
          backgroundColor: 'var(--badge-success-bg)',
          color: 'var(--badge-success-text)',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '600',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          color: '#000000',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '600',
          border: 'none'
        };
      case 'info':
        return {
          backgroundColor: 'var(--badge-info-bg)',
          color: 'var(--badge-info-text)',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '600',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-secondary)',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '500',
          border: '1px solid var(--border-subtle)'
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