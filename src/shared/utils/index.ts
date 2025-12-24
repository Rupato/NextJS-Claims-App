import { formatDistanceToNow, parseISO } from 'date-fns';

// Currency formatting
export const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
};

// Date formatting
export const formatIncidentDate = (dateString: string): string => {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

export const formatCreatedDate = (dateString: string): string => {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

// Status colors (used in both table and filters)
export const getStatusColorClasses = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'Processed':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Sorting logic
import { Claim } from '@/entities/claim/types';
import { SortOption } from '@/shared/types';

export const sortClaims = (
  claims: Claim[],
  sortOption: SortOption
): Claim[] => {
  const sorted = [...claims];

  switch (sortOption) {
    case 'created-newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'created-oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'amount-highest':
      return sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    case 'amount-lowest':
      return sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    case 'total-highest':
      return sorted.sort((a, b) => {
        const totalA = parseFloat(a.amount) + parseFloat(a.processingFee);
        const totalB = parseFloat(b.amount) + parseFloat(b.processingFee);
        return totalB - totalA;
      });
    case 'total-lowest':
      return sorted.sort((a, b) => {
        const totalA = parseFloat(a.amount) + parseFloat(a.processingFee);
        const totalB = parseFloat(b.amount) + parseFloat(b.processingFee);
        return totalA - totalB;
      });
    default:
      return sorted;
  }
};

// Local storage hook
import { useState } from 'react';

export const usePersistedState = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      }
    } catch {
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
        console.warn('localStorage not available, state not persisted');
      }
      return newValue;
    });
  };

  return [state, setPersistedState] as const;
};
