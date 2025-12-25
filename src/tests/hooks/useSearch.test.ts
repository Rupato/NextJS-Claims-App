import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js router hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

import { useSearch } from '@/shared/hooks/useSearch';
import { Claim } from '@/entities/claim/types';

// Mock timer functions
beforeEach(() => {
  vi.useFakeTimers();
});

describe('useSearch', () => {
  const mockClaims: Claim[] = [
    {
      id: '1',
      number: 'CLM-001',
      incidentDate: '2023-12-01T00:00:00Z',
      createdAt: '2023-12-15T00:00:00Z',
      amount: '5000',
      holder: 'John Doe',
      policyNumber: 'POL-12345',
      insuredName: 'Car',
      description: 'Accident repair',
      processingFee: '100',
      status: 'Approved',
    },
    {
      id: '2',
      number: 'CLM-002',
      incidentDate: '2023-12-02T00:00:00Z',
      createdAt: '2023-12-16T00:00:00Z',
      amount: '3000',
      holder: 'Jane Smith',
      policyNumber: 'POL-67890',
      insuredName: 'Phone',
      description: 'Screen replacement',
      processingFee: '75',
      status: 'Pending',
    },
    {
      id: '3',
      number: 'CLM-003',
      incidentDate: '2023-12-03T00:00:00Z',
      createdAt: '2023-12-17T00:00:00Z',
      amount: '7000',
      holder: 'Bob Johnson',
      policyNumber: 'POL-11111',
      insuredName: 'Laptop',
      description: 'Water damage',
      processingFee: '150',
      status: 'Completed',
    },
  ];

  it('returns all claims when search term is empty', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    expect(result.current.filteredClaims).toEqual(mockClaims);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('handles empty claims array', () => {
    const { result } = renderHook(() => useSearch([]));

    expect(result.current.filteredClaims).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.isSearching).toBe(false);
  });
});
