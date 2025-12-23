import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearch } from '../useSearch';
import { Claim } from '../../types/claims';

// Mock timer functions
beforeEach(() => {
  vi.useFakeTimers();
});

describe('useSearch', () => {
  const mockClaims: Claim[] = [
    {
      id: 1,
      number: 'CLM-001',
      incidentDate: '2023-12-01T00:00:00Z',
      createdAt: '2023-12-15T00:00:00Z',
      amount: '5000',
      holder: 'John Doe',
      policyNumber: 'POL-12345',
      processingFee: '100',
      status: 'Approved',
    },
    {
      id: 2,
      number: 'CLM-002',
      incidentDate: '2023-12-02T00:00:00Z',
      createdAt: '2023-12-16T00:00:00Z',
      amount: '3000',
      holder: 'Jane Smith',
      policyNumber: 'POL-67890',
      processingFee: '75',
      status: 'Pending',
    },
    {
      id: 3,
      number: 'CLM-003',
      incidentDate: '2023-12-03T00:00:00Z',
      createdAt: '2023-12-17T00:00:00Z',
      amount: '7000',
      holder: 'Bob Johnson',
      policyNumber: 'POL-11111',
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

  it('filters claims by claim number', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('CLM-001');
    });

    // Fast-forward timers to trigger debouncing
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].number).toBe('CLM-001');
  });

  it('filters claims by holder name', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('Jane');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].holder).toBe('Jane Smith');
  });

  it('filters claims by policy number', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('POL-12345');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].policyNumber).toBe('POL-12345');
  });

  it('performs case-insensitive search', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('john doe');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].holder).toBe('John Doe');
  });

  it('shows loading state while debouncing', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('test');
    });

    // Immediately after setting search term, should show loading
    expect(result.current.isSearching).toBe(true);
    expect(result.current.searchTerm).toBe('test');

    // Results should still be unfiltered during debounce
    expect(result.current.filteredClaims).toEqual(mockClaims);
  });

  it('stops loading after debounce delay', async () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('CLM-001');
    });

    // Should be loading initially
    expect(result.current.isSearching).toBe(true);

    // After debounce delay, should stop loading and filter results
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.filteredClaims).toHaveLength(1);
  });

  it('uses custom debounce delay', () => {
    const { result } = renderHook(() => useSearch(mockClaims, 500));

    act(() => {
      result.current.setSearchTerm('test');
    });

    // Should still be loading after 300ms with 500ms delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isSearching).toBe(true);

    // Should stop loading after full 500ms delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isSearching).toBe(false);
  });

  it('returns empty array when no claims match', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toEqual([]);
  });

  it('handles empty claims array', () => {
    const { result } = renderHook(() => useSearch([]));

    expect(result.current.filteredClaims).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('clears search results when search term becomes empty', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    // Set search term
    act(() => {
      result.current.setSearchTerm('CLM-001');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);

    // Clear search term
    act(() => {
      result.current.setSearchTerm('');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toEqual(mockClaims);
  });

  it('maintains search state correctly through multiple searches', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    // First search
    act(() => {
      result.current.setSearchTerm('CLM-001');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);

    // Second search
    act(() => {
      result.current.setSearchTerm('Jane');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].holder).toBe('Jane Smith');
  });

  it('cancels previous debounce timer when new search is initiated', () => {
    const { result } = renderHook(() => useSearch(mockClaims));

    // Start first search
    act(() => {
      result.current.setSearchTerm('CLM-001');
    });

    // Start second search before first debounce completes
    act(() => {
      result.current.setSearchTerm('Jane');
    });

    // Advance time - should only complete the second search
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filteredClaims).toHaveLength(1);
    expect(result.current.filteredClaims[0].holder).toBe('Jane Smith');
  });
});
