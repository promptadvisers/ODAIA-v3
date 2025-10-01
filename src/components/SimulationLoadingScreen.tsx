import React, { useState, useEffect } from 'react';

interface SimulationLoadingScreenProps {
  onComplete: () => void;
}

export const SimulationLoadingScreen: React.FC<SimulationLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing simulation...');

  useEffect(() => {
    // Randomize total duration between 5-10 seconds (5000-10000ms)
    const totalDuration = Math.floor(Math.random() * 5000) + 5000;
    const startTime = Date.now();

    const statusMessages = [
      'Initializing simulation...',
      'Loading configuration data...',
      'Running simulations...',
      'Analyzing HCP targeting...',
      'Processing curation engine...',
      'Calculating metrics...',
      'Generating results...',
      'Finalizing report...'
    ];

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100);

      setProgress(newProgress);

      // Update status text based on progress
      const statusIndex = Math.min(
        Math.floor((newProgress / 100) * statusMessages.length),
        statusMessages.length - 1
      );
      setStatusText(statusMessages[statusIndex]);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300); // Small delay before transition
      }
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'var(--bg-modal)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        padding: '48px 60px',
        minWidth: '500px',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        {/* Icon/Animation */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          border: '3px solid var(--border-primary)',
          borderTopColor: 'var(--accent-blue)',
          animation: 'spin 1s linear infinite'
        }} />

        {/* Title */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '12px',
          letterSpacing: '-0.02em'
        }}>
          Running Simulation
        </h2>

        {/* Status Text */}
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          minHeight: '21px'
        }}>
          {statusText}
        </p>

        {/* Progress Bar Container */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '12px'
        }}>
          {/* Progress Bar Fill */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--accent-blue)',
            borderRadius: '4px',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
          }} />
        </div>

        {/* Progress Percentage */}
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--accent-blue)',
          letterSpacing: '0.02em'
        }}>
          {Math.round(progress)}%
        </div>

        {/* Keyframe animation for spinner */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
