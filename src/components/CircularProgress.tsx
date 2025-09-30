import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 'md',
  label
}) => {
  const percentage = (value / max) * 100;
  const sizes = {
    sm: { width: 100, height: 100, strokeWidth: 8, fontSize: 'text-lg' },
    md: { width: 150, height: 150, strokeWidth: 10, fontSize: 'text-2xl' },
    lg: { width: 200, height: 200, strokeWidth: 12, fontSize: 'text-3xl' }
  };

  const { width, height, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        className="transform -rotate-90"
        width={width}
        height={height}
      >
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="rgb(31 41 55)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="rgb(59 130 246)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSize} font-bold text-text-primary`}>
          {value}/{max}
        </span>
        {label && (
          <span className="text-xs text-text-muted mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};