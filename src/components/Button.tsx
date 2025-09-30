import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent-blue)',
          color: 'white',
          border: 'none',
          padding: size === 'sm' ? '6px 16px' : '8px 20px',
          fontSize: '13px',
          fontWeight: '500'
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-primary)',
          padding: size === 'sm' ? '6px 16px' : '8px 20px',
          fontSize: '13px',
          fontWeight: '500'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: 'none',
          padding: size === 'sm' ? '6px 12px' : '8px 16px',
          fontSize: '13px',
          fontWeight: '400'
        };
    }
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded transition-all duration-200',
        'focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      style={{
        ...getVariantStyles(),
        borderRadius: '6px',
        cursor: 'pointer',
        minWidth: variant === 'primary' ? '80px' : 'auto'
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.filter = 'brightness(1.1)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.filter = 'brightness(1)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-muted)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};