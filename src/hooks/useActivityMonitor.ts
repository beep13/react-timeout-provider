import { useCallback, useEffect } from 'react';

export interface ActivityConfig {
  events?: string[];
  minResetDuration?: number;
  onActivity?: () => void;
  isEnabled?: boolean;
}

export const useActivityMonitor = ({
  events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'],
  minResetDuration = 1000,
  onActivity,
  isEnabled = true
}: ActivityConfig = {}) => {
  // Simple throttle function
  const throttle = useCallback((fn: () => void, delay: number) => {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn();
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || !onActivity) return;

    const throttledActivity = throttle(onActivity, minResetDuration);

    const handleActivity = () => {
      throttledActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [events, minResetDuration, onActivity, isEnabled, throttle]);
}; 