'use client';

import React from 'react';
import { FormattedClaim } from '../types/claims';
import { TableView } from './TableView';
import { CardsView } from './CardsView';

interface ClaimsViewProps {
  viewMode: 'table' | 'cards';
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  cardStartIndex: number;
  cardEndIndex: number;
  claimsLength: number;
  cardsPerRow: number;
  onTableScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onCardsScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onRowSelect?: (claim: FormattedClaim) => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  viewMode,
  formattedClaims,
  startIndex,
  endIndex,
  cardStartIndex,
  cardEndIndex,
  claimsLength,
  cardsPerRow,
  onTableScroll,
  onCardsScroll,
  hasActiveFilters,
  onRowSelect,
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
