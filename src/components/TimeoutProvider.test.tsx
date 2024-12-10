import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimeoutProvider } from './TimeoutProvider';

describe('TimeoutProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders children without warning initially', () => {
    render(
      <TimeoutProvider
        timeoutDuration={5000}
        warningDuration={2000}
        onTimeout={async () => {}}
      >
        <div>Test Content</div>
      </TimeoutProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows warning after specified duration', () => {
    render(
      <TimeoutProvider
        timeoutDuration={5000}
        warningDuration={2000}
        onTimeout={async () => {}}
      >
        <div>Test Content</div>
      </TimeoutProvider>
    );

    act(() => {
      jest.advanceTimersByTime(3000); // timeoutDuration - warningDuration
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('resets timer on activity', () => {
    render(
      <TimeoutProvider
        timeoutDuration={5000}
        warningDuration={2000}
        onTimeout={async () => {}}
      >
        <div>Test Content</div>
      </TimeoutProvider>
    );

    // Advance to warning
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Simulate user activity and run timers
    act(() => {
      fireEvent.mouseMove(document.body);
      jest.runAllTimers(); // Run any pending timers
    });

    // Warning should be hidden
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
}); 