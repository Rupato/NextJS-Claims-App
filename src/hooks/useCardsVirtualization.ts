'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  CONTAINER_HEIGHT,
  CARDS_PER_ROW,
  CARD_HEIGHT,
} from '../constants/virtualization';

export const useCardsVirtualization = (
  claimsLength: number,
  viewMode: 'table' | 'cards'
) => {
  const [cardScrollTop, setCardScrollTop] = useState(0);

  // Calculate visible cards range using row-based approach for cards
  const { cardStartIndex, cardEndIndex } = useMemo(() => {
    if (viewMode !== 'cards' || claimsLength === 0) {
      return { cardStartIndex: 0, cardEndIndex: 0 };
    }

    // Calculate which row we're scrolled to
    const currentRow = Math.floor(cardScrollTop / CARD_HEIGHT);

    // Calculate visible rows (show current row and buffer)
    const visibleRows = Math.ceil(CONTAINER_HEIGHT / CARD_HEIGHT) + 2; // +2 for buffer
    const startRow = Math.max(0, currentRow - 1); // -1 for buffer
    const endRow = startRow + visibleRows;

    // Convert rows to card indices
    const visibleStart = startRow * CARDS_PER_ROW;
    const visibleEnd = Math.min(endRow * CARDS_PER_ROW, claimsLength);

    return {
      cardStartIndex: visibleStart,
      cardEndIndex: visibleEnd,
    };
  }, [cardScrollTop, claimsLength, viewMode]);

  // Handle cards scroll events
  const handleCardsScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      setCardScrollTop(scrollTop);
    },
    []
  );

  return {
    cardStartIndex,
    cardEndIndex,
    cardScrollTop,
    handleCardsScroll,
  };
};
