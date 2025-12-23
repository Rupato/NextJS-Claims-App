'use client';

import React from 'react';
import { usePersistedState } from '../utils/storage';
import { useClaims } from '../hooks/useClaims';
import { useFormattedClaims } from '../hooks/useFormattedClaims';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import { useCardsVirtualization } from '../hooks/useCardsVirtualization';
import { ViewModeTabs } from './ViewModeTabs';
import { ClaimsView } from './ClaimsView';



const ClaimsDashboard: React.FC = () => {
  const { claims, error } = useClaims();
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>('claims-dashboard-view-mode', 'table');
  const formattedClaims = useFormattedClaims(claims);

  // Virtualization hooks
  const { startIndex, endIndex, handleScroll } = useTableVirtualization(claims.length);
  const { cardStartIndex, cardEndIndex, handleCardsScroll } = useCardsVirtualization(claims.length, viewMode);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="text-lg text-red-600"
          role="alert"
          aria-live="assertive"
        >
          Error loading claims: {error}
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-gray-50 py-8"
      role="main"
      aria-labelledby="dashboard-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header
          className="bg-white shadow-sm rounded-lg overflow-hidden"
          role="banner"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  id="dashboard-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  Claims Dashboard
                </h1>
                <p
                  className="mt-1 text-sm text-gray-600"
                  id="dashboard-description"
                >
                  View and manage all insurance claims
                </p>
              </div>

              <ViewModeTabs
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </header>

        <nav aria-label="Dashboard actions" className="sr-only">
          <p>
            Use Tab to navigate through the claims table. Use Enter or Space to
            interact with focusable elements.
          </p>
        </nav>

        <section
          className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden"
          aria-labelledby="claims-section-title"
          aria-describedby={
            viewMode === 'table' ? 'claims-table-desc' : 'claims-cards-desc'
          }
        >
          <div className="sr-only">
            <h2 id="claims-section-title">Insurance Claims Data</h2>
          </div>

          <ClaimsView
            viewMode={viewMode}
            formattedClaims={formattedClaims}
            startIndex={startIndex}
            endIndex={endIndex}
            cardStartIndex={cardStartIndex}
            cardEndIndex={cardEndIndex}
            claimsLength={claims.length}
            onTableScroll={handleScroll}
            onCardsScroll={handleCardsScroll}
          />
        </section>
      </div>
    </main>
  );
};

export default ClaimsDashboard;
