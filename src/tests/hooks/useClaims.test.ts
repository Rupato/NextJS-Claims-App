import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClaims } from '@/features/claims-management/hooks/useClaims';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('useClaims', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useClaims());

    expect(result.current.loading).toBe(true);
    expect(result.current.claims).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns claims data on successful fetch', async () => {
    const mockClaims = [
      {
        id: 1,
        number: 'CLM-001',
        incidentDate: '2023-01-01',
        createdAt: '2023-01-02',
        amount: '1000',
        holder: 'John Doe',
        policyNumber: 'POL-001',
        processingFee: '50',
        status: 'Approved',
      },
    ];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockClaims),
    });

    const { result } = renderHook(() => useClaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.claims).toEqual(mockClaims);
    expect(result.current.error).toBeNull();
  });

  it('handles HTTP error response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useClaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.claims).toEqual([]);
    expect(result.current.error).toBe('HTTP error! status: 404');
  });

  it('handles network error', async () => {
    const networkError = new Error('Network error');
    fetchMock.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useClaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.claims).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('handles non-Error thrown objects', async () => {
    fetchMock.mockRejectedValueOnce('String error');

    const { result } = renderHook(() => useClaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.claims).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch claims');
  });

  it('makes fetch request with correct parameters', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderHook(() => useClaims());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://api-mock:8001/api/v1/claims',
        {
          headers: {
            'Cache-Control': 'max-age=300',
          },
        }
      );
    });
  });
});
