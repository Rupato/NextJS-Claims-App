'use client';

import React from 'react';
import { TableView } from './TableView';
import { CardsView } from './CardsView';
import { ClaimsViewProps } from './types';
import { TableSkeleton } from './TableSkeleton';
import { CardsSkeleton } from './CardsSkeleton';
import { LoadingOverlay } from './LoadingOverlay';

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
  isLoading = false,
}: ClaimsViewProps & { isLoading?: boolean }) => {
  return (
    <div className="relative">
      {viewMode === 'table' ? (
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
      ) : (
        <CardsView
          formattedClaims={formattedClaims}
          cardStartIndex={cardStartIndex}
          cardEndIndex={cardEndIndex}
          cardsPerRow={cardsPerRow}
          onScroll={onCardsScroll}
          hasActiveFilters={hasActiveFilters}
          onCardClick={onRowSelect}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white z-10">
          {viewMode === 'table' ? <TableSkeleton /> : <CardsSkeleton />}
          <LoadingOverlay />
        </div>
      )}
    </div>
  );
};
