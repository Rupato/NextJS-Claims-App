import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePersistedState } from '../storage';

describe('usePersistedState', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns default value when localStorage is available but no stored value', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns parsed stored value when localStorage has valid JSON', () => {
    const storedValue = { name: 'John', age: 30 };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedValue));

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    expect(result.current[0]).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns default value when localStorage has invalid JSON', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'localStorage not available, using default value'
    );

    consoleWarnSpy.mockRestore();
  });

  it('persists value to localStorage when setState is called', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      '"new-value"'
    );
    expect(result.current[0]).toBe('new-value');
  });

  it('handles function updater', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => usePersistedState('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '1');
    expect(result.current[0]).toBe(1);
  });

  it('handles localStorage setItem error gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value'); // State should still update
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'localStorage not available, state not persisted'
    );

    consoleWarnSpy.mockRestore();
  });

  it('handles localStorage getItem error gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      usePersistedState('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'localStorage not available, using default value'
    );

    consoleWarnSpy.mockRestore();
  });

  it('works with different data types', () => {
    localStorageMock.getItem.mockReturnValue(null);

    // Test with object
    const { result: result1 } = renderHook(() =>
      usePersistedState('object-key', { count: 0 })
    );

    act(() => {
      result1.current[1]({ count: 1 });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'object-key',
      '{"count":1}'
    );

    // Test with array
    const { result: result2 } = renderHook(() =>
      usePersistedState('array-key', [1, 2, 3])
    );

    act(() => {
      result2.current[1]([4, 5, 6]);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'array-key',
      '[4,5,6]'
    );
  });
});
