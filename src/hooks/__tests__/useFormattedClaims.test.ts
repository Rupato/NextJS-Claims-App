import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormattedClaims } from '../useFormattedClaims';
import { Claim } from '../../types/claims';

describe('useFormattedClaims', () => {
  it('returns empty array when claims is empty', () => {
    const { result } = renderHook(() => useFormattedClaims([]));

    expect(result.current).toEqual([]);
  });

  it('formats claims correctly', () => {
    const mockClaims: Claim[] = [
      {
        id: '1',
        number: 'CLM-001',
        incidentDate: '2023-12-01T00:00:00Z',
        createdAt: '2023-12-15T00:00:00Z',
        amount: '5000.50',
        holder: 'John Doe',
        policyNumber: 'POL-12345',
        processingFee: '100.25',
        status: 'Approved',
      },
    ];

    const { result } = renderHook(() => useFormattedClaims(mockClaims));

    expect(result.current).toHaveLength(1);
    const formattedClaim = result.current[0];

    expect(formattedClaim).toMatchObject({
      id: '1',
      number: 'CLM-001',
      holder: 'John Doe',
      policyNumber: 'POL-12345',
      status: 'Approved',
    });

    // Check formatted fields
    expect(formattedClaim.formattedClaimAmount).toBe('$5,000.50');
    expect(formattedClaim.formattedProcessingFee).toBe('$100.25');
    expect(formattedClaim.formattedTotalAmount).toBe('$5,100.75');
    expect(formattedClaim.formattedIncidentDate).toMatch(/ago$/);
    expect(formattedClaim.formattedCreatedDate).toMatch(/ago$/);
  });

  it('handles multiple claims', () => {
    const mockClaims: Claim[] = [
      {
        id: '1',
        number: 'CLM-001',
        incidentDate: '2023-12-01T00:00:00Z',
        createdAt: '2023-12-15T00:00:00Z',
        amount: '1000',
        holder: 'John Doe',
        policyNumber: 'POL-001',
        processingFee: '50',
        status: 'Approved',
      },
      {
        id: '2',
        number: 'CLM-002',
        incidentDate: '2023-11-15T00:00:00Z',
        createdAt: '2023-12-01T00:00:00Z',
        amount: '2000',
        holder: 'Jane Smith',
        policyNumber: 'POL-002',
        processingFee: '75',
        status: 'Rejected',
      },
    ];

    const { result } = renderHook(() => useFormattedClaims(mockClaims));

    expect(result.current).toHaveLength(2);

    expect(result.current[0].formattedTotalAmount).toBe('$1,050.00');
    expect(result.current[1].formattedTotalAmount).toBe('$2,075.00');
  });

  it('memoizes results', () => {
    const mockClaims: Claim[] = [
      {
        id: '1',
        number: 'CLM-001',
        incidentDate: '2023-12-01T00:00:00Z',
        createdAt: '2023-12-15T00:00:00Z',
        amount: '1000',
        holder: 'John Doe',
        policyNumber: 'POL-001',
        processingFee: '50',
        status: 'Approved',
      },
    ];

    const { result, rerender } = renderHook(
      (claims) => useFormattedClaims(claims),
      { initialProps: mockClaims }
    );

    const firstResult = result.current;

    // Rerender with same claims
    rerender(mockClaims);

    // Should return the same reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it('recalculates when claims change', () => {
    const mockClaims1: Claim[] = [
      {
        id: '1',
        number: 'CLM-001',
        incidentDate: '2023-12-01T00:00:00Z',
        createdAt: '2023-12-15T00:00:00Z',
        amount: '1000',
        holder: 'John Doe',
        policyNumber: 'POL-001',
        processingFee: '50',
        status: 'Approved',
      },
    ];

    const mockClaims2: Claim[] = [
      {
        id: '2',
        number: 'CLM-002',
        incidentDate: '2023-11-15T00:00:00Z',
        createdAt: '2023-12-01T00:00:00Z',
        amount: '2000',
        holder: 'Jane Smith',
        policyNumber: 'POL-002',
        processingFee: '75',
        status: 'Rejected',
      },
    ];

    const { result, rerender } = renderHook(
      (claims) => useFormattedClaims(claims),
      { initialProps: mockClaims1 }
    );

    const firstResult = result.current;

    // Rerender with different claims
    rerender(mockClaims2);

    // Should return different result
    expect(result.current).not.toBe(firstResult);
    expect(result.current[0].number).toBe('CLM-002');
  });
});
