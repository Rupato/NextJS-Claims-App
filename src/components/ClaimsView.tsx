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
  onTableScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onCardsScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  viewMode,
  formattedClaims,
  startIndex,
  endIndex,
  cardStartIndex,
  cardEndIndex,
  claimsLength,
  onTableScroll,
  onCardsScroll,
}) => {
  if (viewMode === 'table') {
    return (
      <TableView
        formattedClaims={formattedClaims}
        startIndex={startIndex}
        endIndex={endIndex}
        claimsLength={claimsLength}
        onScroll={onTableScroll}
      />
    );
  }

  return (
    <CardsView
      formattedClaims={formattedClaims}
      cardStartIndex={cardStartIndex}
      cardEndIndex={cardEndIndex}
      claimsLength={claimsLength}
      onScroll={onCardsScroll}
    />
  );
};
