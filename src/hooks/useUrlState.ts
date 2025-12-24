// Simple URL state hook for strings
import { useCallback, useEffect, useRef, useState } from 'react';

export function useUrlStringState(key: string, defaultValue: string = '') {
  const [value, setValue] = useState(defaultValue);
  const initializedRef = useRef(false);

  // Initialize from URL on mount (client-side only)
  useEffect(() => {
    if (!initializedRef.current && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(key);
      if (paramValue !== null) {
        setValue(paramValue);
      }
      initializedRef.current = true;
    }
  }, [key]);

  const updateValue = useCallback(
    (newValue: string | ((prev: string) => string)) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;
      setValue(actualValue);

      const urlParams = new URLSearchParams(window.location.search);
      if (actualValue === defaultValue) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, actualValue);
      }

      const newSearch = urlParams.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [value, key, defaultValue]
  );

  return [value, updateValue] as const;
}

// URL state hook for string arrays
export function useUrlArrayState(key: string, defaultValue: string[] = []) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(key);
      return paramValue !== null && paramValue !== ''
        ? paramValue.split(',').map((s) => s.trim())
        : defaultValue;
    }
    return defaultValue;
  });

  const updateValue = useCallback(
    (newValue: string[] | ((prev: string[]) => string[])) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;
      setValue(actualValue);

      const urlParams = new URLSearchParams(window.location.search);
      if (
        actualValue.length === 0 ||
        (actualValue.length === 1 && actualValue[0] === '')
      ) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, actualValue.join(','));
      }

      const newSearch = urlParams.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [value, key]
  );

  return [value, updateValue] as const;
}

// URL state hook for sort options (string enum)
export function useUrlSortState(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(key);
      return paramValue !== null ? paramValue : defaultValue;
    }
    return defaultValue;
  });

  const updateValue = useCallback(
    (newValue: string | ((prev: string) => string)) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;
      setValue(actualValue);

      const urlParams = new URLSearchParams(window.location.search);
      if (actualValue === defaultValue) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, actualValue);
      }

      const newSearch = urlParams.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [value, key, defaultValue]
  );

  return [value, updateValue] as const;
}
