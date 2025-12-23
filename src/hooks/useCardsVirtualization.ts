'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  CONTAINER_HEIGHT,
  CARDS_PER_ROW,
  CARD_HEIGHT,
  CARD_BUFFER_SIZE,
} from '../constants/virtualization';

export const useCardsVirtualization = (claimsLength: number, viewMode: 'table' | 'cards') => {
  const [cardScrollTop, setCardScrollTop] = useState(0);

  // Calculate visible cards range based on claimsLength, viewMode and scrollTop
  const { cardStartIndex, cardEndIndex } = useMemo(() => {
    if (viewMode !== 'cards' || claimsLength === 0) {
      return { cardStartIndex: 0, cardEndIndex: 0 };
    }

    const visibleStart = Math.floor(cardScrollTop / CARD_HEIGHT) * CARDS_PER_ROW;
    const visibleEnd = Math.min(
      visibleStart +
        Math.ceil(CONTAINER_HEIGHT / CARD_HEIGHT) * CARDS_PER_ROW +
        CARD_BUFFER_SIZE,
      claimsLength
    );

    // Add buffer zones
    const bufferedStart = Math.max(0, visibleStart - CARD_BUFFER_SIZE);
    const bufferedEnd = Math.min(
      claimsLength,
      visibleEnd + CARD_BUFFER_SIZE
    );

    return {
      cardStartIndex: bufferedStart,
      cardEndIndex: bufferedEnd,
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
