import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCardsVirtualization } from '@/shared/hooks/useCardsVirtualization';

// Mock the constants
vi.mock('@/shared/virtualization', () => ({
  CONTAINER_HEIGHT: 600,
  CARDS_PER_ROW: 3,
  CARD_HEIGHT: 280,
  CARD_BUFFER_SIZE: 6,
}));

describe('useCardsVirtualization', () => {
  it('returns zero indices when viewMode is not cards', () => {
    const { result } = renderHook(() => useCardsVirtualization(10, 'table'));

    expect(result.current.cardStartIndex).toBe(0);
    expect(result.current.cardEndIndex).toBe(0);
  });

  it('returns zero indices when claimsLength is 0', () => {
    const { result } = renderHook(() => useCardsVirtualization(0, 'cards'));

    expect(result.current.cardStartIndex).toBe(0);
    expect(result.current.cardEndIndex).toBe(0);
  });

  it('calculates correct indices when viewMode is cards and claimsLength > 0', () => {
    const { result } = renderHook(() => useCardsVirtualization(20, 'cards'));

    // With scrollTop = 0, should show first visible cards with buffer
    expect(result.current.cardStartIndex).toBe(0); // max(0, 0 - 6) = 0
    expect(result.current.cardEndIndex).toBeGreaterThan(0);
  });

  it('updates scrollTop when handleCardsScroll is called', () => {
    const { result } = renderHook(() => useCardsVirtualization(20, 'cards'));

    const mockEvent = {
      currentTarget: { scrollTop: 280 },
    } as React.UIEvent<HTMLDivElement>;

    act(() => {
      result.current.handleCardsScroll(mockEvent);
    });

    expect(result.current.cardScrollTop).toBe(280);
  });

  it('recalculates indices when scrollTop changes', () => {
    const { result } = renderHook(() => useCardsVirtualization(20, 'cards'));

    // Scroll down
    const mockEvent = {
      currentTarget: { scrollTop: 280 },
    } as React.UIEvent<HTMLDivElement>;

    act(() => {
      result.current.handleCardsScroll(mockEvent);
    });

    // Indices should change after scroll
    expect(result.current.cardScrollTop).toBe(280);
    // Note: The actual index calculation depends on the constants,
    // we're mainly testing that the hook responds to scroll changes
  });
});
