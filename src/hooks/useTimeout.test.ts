import { renderHook, act } from '@testing-library/react';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should start with warning hidden', () => {
    const { result } = renderHook(() =>
      useTimeout({
        timeoutDuration: 5000,
        warningDuration: 2000,
        onTimeout: async () => {},
      })
    );

    expect(result.current.showWarning).toBe(false);
    expect(result.current.remainingSeconds).toBe(0);
  });

  it('should show warning after specified duration', () => {
    const onWarning = jest.fn();
    
    const { result } = renderHook(() =>
      useTimeout({
        timeoutDuration: 5000,
        warningDuration: 2000,
        onTimeout: async () => {},
        onWarning,
      })
    );

    act(() => {
      jest.advanceTimersByTime(3000); // timeoutDuration - warningDuration
    });

    expect(result.current.showWarning).toBe(true);
    expect(onWarning).toHaveBeenCalled();
    expect(result.current.remainingSeconds).toBe(2);
  });
}); 