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
          color: '#ffffff',
          border: 'none',
          padding: size === 'sm' ? '8px 18px' : '10px 24px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(59, 130, 246, 0.25)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          padding: size === 'sm' ? '8px 18px' : '10px 24px',
          fontSize: '13px',
          fontWeight: '500'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
          padding: size === 'sm' ? '6px 12px' : '8px 16px',
          fontSize: '13px',
          fontWeight: '500'
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
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.borderColor = 'var(--accent-blue)';
          e.currentTarget.style.color = 'var(--accent-blue)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.filter = 'brightness(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.25)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-primary)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};