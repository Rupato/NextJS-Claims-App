'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// URL state hook for strings using Next.js search params
export function useUrlStringState(key: string, defaultValue: string = '') {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = useMemo(() => {
    const paramValue = searchParams.get(key);
    return paramValue !== null ? paramValue : defaultValue;
  }, [searchParams, key, defaultValue]);

  const updateValue = useCallback(
    (newValue: string | ((prev: string) => string)) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;

      const params = new URLSearchParams(searchParams.toString());

      if (actualValue === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, actualValue);
      }

      const newSearch = params.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [value, key, searchParams, router, defaultValue]
  );

  return [value, updateValue] as const;
}

// URL state hook for string arrays using Next.js search params
export function useUrlArrayState(key: string, defaultValue: string[] = []) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = useMemo(() => {
    // Support multiple parameters with same key: ?status=Approved&status=Completed&status=Processed
    const paramValues = searchParams.getAll(key);
    if (paramValues.length > 0) {
      return paramValues.filter((v) => v !== '');
    }

    // Fallback to single parameter with separators for backward compatibility
    const paramValue = searchParams.get(key);
    if (paramValue !== null && paramValue !== '') {
      // Check for different separators
      const separators = [';', '|', ','];
      for (const sep of separators) {
        if (paramValue.includes(sep)) {
          return paramValue
            .split(sep)
            .map((s) => s.trim())
            .filter((s) => s !== '');
        }
      }
      // Single value
      return [paramValue];
    }

    return defaultValue;
  }, [searchParams, key, defaultValue]);

  const updateValue = useCallback(
    (newValue: string[] | ((prev: string[]) => string[])) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;

      const params = new URLSearchParams(searchParams.toString());

      // Remove all existing instances of this key
      params.delete(key);

      // Add each value as a separate parameter
      actualValue.forEach((val) => {
        if (val && val.trim() !== '') {
          params.append(key, val.trim());
        }
      });

      const newSearch = params.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [value, key, searchParams, router]
  );

  return [value, updateValue] as const;
}

// URL state hook for sort options using Next.js search params
export function useUrlSortState(key: string, defaultValue: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = useMemo(() => {
    const paramValue = searchParams.get(key);
    return paramValue !== null ? paramValue : defaultValue;
  }, [searchParams, key, defaultValue]);

  const updateValue = useCallback(
    (newValue: string | ((prev: string) => string)) => {
      const actualValue =
        typeof newValue === 'function' ? newValue(value) : newValue;

      const params = new URLSearchParams(searchParams.toString());

      if (actualValue === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, actualValue);
      }

      const newSearch = params.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [value, key, searchParams, router, defaultValue]
  );

  return [value, updateValue] as const;
}
