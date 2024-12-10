import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimeoutConfig {
  timeoutDuration: number;
  warningDuration: number;
  onTimeout: () => Promise<void>;
  onWarning?: () => void;
  isEnabled?: boolean;
}

type TimerRef = ReturnType<typeof setTimeout> | null;
type IntervalRef = ReturnType<typeof setInterval> | null;

export const useTimeout = ({
  timeoutDuration,
  warningDuration,
  onTimeout,
  onWarning,
  isEnabled = true,
}: TimeoutConfig) => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  
  const timeoutRef = useRef<TimerRef>(null);
  const warningRef = useRef<TimerRef>(null);
  const intervalRef = useRef<IntervalRef>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (!isEnabled) return;

    cleanup();
    lastActivityRef.current = Date.now();

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingSeconds(Math.floor(warningDuration / 1000));
      onWarning?.();

      // Start countdown
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            cleanup();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, timeoutDuration - warningDuration);

    // Set final timeout
    timeoutRef.current = setTimeout(() => {
      cleanup();
      setShowWarning(false);
      onTimeout();
    }, timeoutDuration);
  }, [timeoutDuration, warningDuration, onTimeout, onWarning, isEnabled, cleanup]);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setRemainingSeconds(0);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return cleanup;
  }, [startTimer, cleanup]);

  return {
    showWarning,
    remainingSeconds,
    startTimer,
    resetTimer,
    cleanup,
    lastActivity: lastActivityRef.current,
  };
}; 