'use client';

import React from 'react';
import { FormattedClaim } from '@/entities/claim/types';
import { SortOption } from '@/shared/types';
import { TableView } from './TableView';
import { CardsView } from './CardsView';

interface ClaimsViewProps {
  viewMode: 'table' | 'cards';
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  cardStartIndex: number;
  cardEndIndex: number;
  cardsPerRow: number;
  onTableScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onCardsScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onRowSelect?: (claim: FormattedClaim) => void;
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: SortOption) => void;
  currentSort?: SortOption;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  viewMode,
  formattedClaims,
  startIndex,
  endIndex,
  cardStartIndex,
  cardEndIndex,
  cardsPerRow,
  onTableScroll,
  onCardsScroll,
  hasActiveFilters,
  onRowSelect,
  columnVisibility,
  onColumnSort,
  currentSort,
}) => {
  if (viewMode === 'table') {
    return (
      <TableView
        formattedClaims={formattedClaims}
        startIndex={startIndex}
        endIndex={endIndex}
        onScroll={onTableScroll}
        hasActiveFilters={hasActiveFilters}
        onRowSelect={onRowSelect}
        columnVisibility={columnVisibility}
        onColumnSort={onColumnSort}
        currentSort={currentSort}
      />
    );
  }

  return (
    <CardsView
      formattedClaims={formattedClaims}
      cardStartIndex={cardStartIndex}
      cardEndIndex={cardEndIndex}
      cardsPerRow={cardsPerRow}
      onScroll={onCardsScroll}
      hasActiveFilters={hasActiveFilters}
      onCardClick={onRowSelect}
    />
  );
};
