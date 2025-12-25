'use client';

import React from 'react';
import { TableView } from './TableView';
import { CardsView } from './CardsView';
import { ClaimsViewProps } from './types';

export const ClaimsView = ({
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
}: ClaimsViewProps) => {
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
