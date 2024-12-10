import React, { ReactNode } from 'react';
import TimeoutContext from '../contexts/TimeoutContext';
import { useTimeout, TimeoutConfig } from '../hooks/useTimeout';
import { useActivityMonitor } from '../hooks/useActivityMonitor';

export interface TimeoutProviderProps extends TimeoutConfig {
  children: ReactNode;
  warningMessage?: string;
  WarningComponent?: React.ComponentType<WarningProps>;
  activityEvents?: string[];
  minResetDuration?: number;
  onError?: (error: Error) => void;
  fallback?: ReactNode;
}

export interface WarningProps {
  message: string;
  remainingSeconds: number;
  onExtend: () => void;
  className?: string;
  formatTime?: (seconds: number) => string;
}

const DefaultWarning = ({ 
  message, 
  remainingSeconds, 
  onExtend 
}: WarningProps) => (
  <div role="alert" className="timeout-warning">
    <p>{message || `Session will timeout in ${remainingSeconds} seconds`}</p>
    <button onClick={onExtend}>Continue Session</button>
  </div>
);

export const TimeoutProvider = ({
  children,
  warningMessage,
  WarningComponent = DefaultWarning,
  activityEvents,
  minResetDuration = 1000,
  onError,
  fallback,
  ...timeoutConfig
}: TimeoutProviderProps) => {
  const {
    showWarning,
    remainingSeconds,
    startTimer,
    resetTimer,
    cleanup
  } = useTimeout(timeoutConfig);

  useActivityMonitor({
    events: activityEvents,
    minResetDuration,
    onActivity: resetTimer,
    isEnabled: timeoutConfig.isEnabled
  });

  // Error boundary fallback
  if (fallback && !timeoutConfig.isEnabled) {
    return <>{fallback}</>;
  }

  return (
    <TimeoutContext.Provider 
      value={{
        showWarning,
        remainingSeconds,
        startTimer,
        resetTimer,
        cleanup
      }}
    >
      {children}
      {showWarning && (
        <WarningComponent
          message={warningMessage || ''}
          remainingSeconds={remainingSeconds}
          onExtend={resetTimer}
        />
      )}
    </TimeoutContext.Provider>
  );
}; 