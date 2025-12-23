'use client';

import React from 'react';
import { usePersistedState } from '../utils/storage';
import { useClaims } from '../hooks/useClaims';
import { useFormattedClaims } from '../hooks/useFormattedClaims';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import { useCardsVirtualization } from '../hooks/useCardsVirtualization';
import { ViewModeTabs } from './ViewModeTabs';
import { ClaimsView } from './ClaimsView';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

const ClaimsDashboard: React.FC = () => {
  const { claims, loading, error } = useClaims();
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>('claims-dashboard-view-mode', 'table');
  const formattedClaims = useFormattedClaims(claims);

  // Virtualization hooks
  const { startIndex, endIndex, handleScroll } = useTableVirtualization(claims.length);
  const { cardStartIndex, cardEndIndex, handleCardsScroll } = useCardsVirtualization(claims.length, viewMode);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                Claims Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage all insurance claims
              </p>
            </div>
            <div className="px-6 py-8">
              <LoadingSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
