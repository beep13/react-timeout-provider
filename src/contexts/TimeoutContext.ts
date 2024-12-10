import { createContext, useContext } from 'react';

export interface TimeoutContextValue {
  showWarning: boolean;
  remainingSeconds: number;
  startTimer: () => void;
  resetTimer: () => void;
  cleanup: () => void;
}

const TimeoutContext = createContext<TimeoutContextValue | null>(null);

export const useTimeoutContext = () => {
  const context = useContext(TimeoutContext);
  if (!context) {
    throw new Error('useTimeoutContext must be used within a TimeoutProvider');
  }
  return context;
};

export default TimeoutContext; 