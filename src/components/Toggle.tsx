import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  ariaLabel
}) => {
  const widths = size === 'sm' ? 36 : 44;
  const heights = size === 'sm' ? 20 : 24;
  const thumbSize = size === 'sm' ? 16 : 20;
  const padding = 2;

  const offTransform = `translateX(${padding}px)`;
  const onTransform = `translateX(${widths - thumbSize - padding}px)`;

  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: `${widths}px`,
        height: `${heights}px`,
        borderRadius: `${heights / 2}px`,
        padding: '0',
        background: checked ? 'var(--toggle-track-on)' : 'var(--toggle-track-off)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'background-color 160ms ease',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: `${(heights - thumbSize) / 2}px`,
          left: 0,
          width: `${thumbSize}px`,
          height: `${thumbSize}px`,
          borderRadius: '999px',
          backgroundColor: 'var(--toggle-thumb)',
          transform: checked ? onTransform : offTransform,
          transition: 'transform 160ms ease',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.3)'
        }}
      />
    </button>
  );
};

