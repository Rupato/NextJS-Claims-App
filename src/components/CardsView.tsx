'use client';

import React, { useRef } from 'react';
import { FormattedClaim } from '../types/claims';
import { ClaimCard } from './ClaimCard';
import {
  CONTAINER_HEIGHT,
  CARDS_PER_ROW,
  CARD_HEIGHT,
} from '../constants/virtualization';

interface CardsViewProps {
  formattedClaims: FormattedClaim[];
  cardStartIndex: number;
  cardEndIndex: number;
  claimsLength: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({
  formattedClaims,
  cardStartIndex,
  cardEndIndex,
  claimsLength,
  onScroll,
}) => {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={cardsContainerRef}
        className="overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={onScroll}
        role="region"
        aria-labelledby="claims-cards"
        aria-describedby="claims-cards-desc"
        tabIndex={0}
        aria-label="Virtualized claims cards - scroll to load more data"
      >
        {/* Top spacer for cards virtualization */}
        <div
          style={{
            height: Math.floor(cardStartIndex / CARDS_PER_ROW) * CARD_HEIGHT,
          }}
        />

        <div className="p-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            id="claims-cards"
          >
            {formattedClaims
              .slice(cardStartIndex, cardEndIndex)
              .map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
              ))}
          </div>
        </div>

        {/* Bottom spacer for cards virtualization */}
        <div
          style={{
            height:
              Math.floor((claimsLength - cardEndIndex) / CARDS_PER_ROW) *
              CARD_HEIGHT,
          }}
        />
      </div>

      <div
        className="px-6 py-4 border-t border-gray-200 bg-gray-50"
        id="claims-cards-desc"
      >
        <div>
          <p className="text-sm text-gray-500">
            Virtualized cards: Showing {cardEndIndex - cardStartIndex} rendered
            cards of {claimsLength} total claims. Scroll to dynamically
            load/unload data for optimal performance.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rendered range: {cardStartIndex + 1}-
            {Math.min(cardEndIndex, claimsLength)} | Last updated:{' '}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};
