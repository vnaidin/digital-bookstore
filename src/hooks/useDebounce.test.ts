import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay has passed', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'initial' },
    });

    rerender({ val: 'updated' });
    expect(result.current).toBe('initial');
  });

  it('updates the value after the delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'initial' },
    });

    rerender({ val: 'updated' });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('updated');
  });

  it('resets the timer if value changes before delay fires', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'first' },
    });

    rerender({ val: 'second' });
    act(() => { vi.advanceTimersByTime(100); });
    rerender({ val: 'third' });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('first');

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('third');
  });
});
