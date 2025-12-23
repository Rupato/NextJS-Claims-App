'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ROW_HEIGHT,
  BUFFER_SIZE,
  CONTAINER_HEIGHT,
} from '../constants/virtualization';

export const useTableVirtualization = (claimsLength: number) => {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range based on claimsLength and scrollTop
  const { startIndex, endIndex } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(600 / ROW_HEIGHT) + BUFFER_SIZE, // 600 is CONTAINER_HEIGHT
      claimsLength
    );

    // Add buffer zones
    const bufferedStart = Math.max(0, visibleStart - BUFFER_SIZE);
    const bufferedEnd = Math.min(claimsLength, visibleEnd + BUFFER_SIZE);

    return {
      startIndex: bufferedStart,
      endIndex: bufferedEnd,
    };
  }, [scrollTop, claimsLength]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setScrollTop(scrollTop);
  }, []);

  return {
    startIndex,
    endIndex,
    scrollTop,
    handleScroll,
  };
};
