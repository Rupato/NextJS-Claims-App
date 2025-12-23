import { useState } from 'react';

export const usePersistedState = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      }
      } catch {
        // localStorage not available (test environment, SSR, etc.)
        console.warn('localStorage not available, using default value');
      }
    return defaultValue;
  });

  const setPersistedState = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue =
        typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch {
        // localStorage not available, silently continue
        console.warn('localStorage not available, state not persisted');
      }
      return newValue;
    });
  };

  return [state, setPersistedState] as const;
};
