import { renderHook, act } from '@testing-library/react';
import { useActivityMonitor } from './useActivityMonitor';

describe('useActivityMonitor', () => {
  let dateNowSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    dateNowSpy.mockRestore();
  });

  it('should call onActivity when activity is detected', () => {
    const onActivity = jest.fn();
    
    renderHook(() => 
      useActivityMonitor({
        events: ['click'],
        onActivity,
        minResetDuration: 1000
      })
    );

    // Initial activity
    act(() => {
      dateNowSpy.mockReturnValue(2000);
      window.dispatchEvent(new Event('click', { bubbles: true }));
      jest.runAllTimers();
    });

    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  it('should throttle activity calls', () => {
    const onActivity = jest.fn();
    
    renderHook(() => 
      useActivityMonitor({
        events: ['click'],
        onActivity,
        minResetDuration: 2000
      })
    );

    // First activity
    act(() => {
      dateNowSpy.mockReturnValue(2000);
      window.dispatchEvent(new Event('click', { bubbles: true }));
      jest.runAllTimers();
    });

    expect(onActivity).toHaveBeenCalledTimes(1);

    // Second activity (should be throttled)
    act(() => {
      dateNowSpy.mockReturnValue(3000);
      window.dispatchEvent(new Event('click', { bubbles: true }));
      jest.runAllTimers();
    });

    expect(onActivity).toHaveBeenCalledTimes(1);

    // Third activity (after throttle period)
    act(() => {
      dateNowSpy.mockReturnValue(4500);
      window.dispatchEvent(new Event('click', { bubbles: true }));
      jest.runAllTimers();
    });

    expect(onActivity).toHaveBeenCalledTimes(2);
  });

  it('should not listen to events when disabled', () => {
    const onActivity = jest.fn();
    
    renderHook(() => 
      useActivityMonitor({
        events: ['click'],
        onActivity,
        isEnabled: false
      })
    );

    act(() => {
      window.dispatchEvent(new Event('click', { bubbles: true }));
      jest.runAllTimers();
    });

    expect(onActivity).not.toHaveBeenCalled();
  });
}); 