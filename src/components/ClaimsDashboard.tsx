'use client';

import React from 'react';
import { usePersistedState } from '../utils/storage';
import { useClaims } from '../hooks/useClaims';
import { useFormattedClaims } from '../hooks/useFormattedClaims';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import { useCardsVirtualization } from '../hooks/useCardsVirtualization';
import { useSearch } from '../hooks/useSearch';
import { ViewModeTabs } from './ViewModeTabs';
import { SearchInput } from './SearchInput';
import { ClaimsView } from './ClaimsView';
import { LoadingSkeleton } from './LoadingSkeleton';

const ClaimsDashboard: React.FC = () => {
  const { claims, loading, error } = useClaims();
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>(
    'claims-dashboard-view-mode',
    'table'
  );

  // Search functionality
  const { searchTerm, setSearchTerm, filteredClaims, isSearching } = useSearch(claims);

  // Always call hooks in same order (Rules of Hooks)
  const formattedClaims = useFormattedClaims(filteredClaims);
  const { startIndex, endIndex, handleScroll } = useTableVirtualization(
    filteredClaims.length
  );
  const { cardStartIndex, cardEndIndex, handleCardsScroll, cardsPerRow } =
    useCardsVirtualization(filteredClaims.length, viewMode);

  // Loading skeleton component
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
            <LoadingSkeleton viewMode={viewMode} />
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
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onFocus={(e) => e.target.classList.remove('sr-only')}
        onBlur={(e) => e.target.classList.add('sr-only')}
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header
          className="bg-white shadow-sm rounded-lg overflow-hidden"
          role="banner"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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

              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  isSearching={isSearching}
                />
                <ViewModeTabs
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Screen Reader Navigation Instructions */}
        <nav aria-label="Dashboard actions" className="sr-only">
          <p>
            Use Tab to navigate through the claims table. Use Enter or Space to
            interact with focusable elements. Use arrow keys to navigate between
            view modes.
          </p>
        </nav>

        {/* Live Region for Status Updates */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          id="dashboard-status"
        >
          {filteredClaims.length > 0 &&
            `Displaying ${filteredClaims.length} of ${claims.length} insurance claims in ${viewMode} view${searchTerm ? ` matching "${searchTerm}"` : ''}`}
        </div>

        <section
          id="main-content"
          className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden"
          aria-labelledby="claims-section-title"
          aria-describedby={
            viewMode === 'table'
              ? 'claims-table-desc claims-table-instructions'
              : 'claims-cards-desc claims-cards-instructions'
          }
        >
          <div className="sr-only">
            <h2 id="claims-section-title">Insurance Claims Data</h2>
            <div id="claims-table-instructions">
              Table view: Use arrow keys to navigate cells, Enter to interact
              with rows. Virtualized for performance with {filteredClaims.length} of {claims.length} claims shown{searchTerm ? ` matching "${searchTerm}"` : ''}.
            </div>
            <div id="claims-cards-instructions">
              Cards view: Use Tab to navigate between cards, Enter to expand
              details. Virtualized grid with {filteredClaims.length} of {claims.length} claims shown{searchTerm ? ` matching "${searchTerm}"` : ''}.
            </div>
          </div>

          <ClaimsView
            viewMode={viewMode}
            formattedClaims={formattedClaims}
            startIndex={startIndex}
            endIndex={endIndex}
            cardStartIndex={cardStartIndex}
            cardEndIndex={cardEndIndex}
            claimsLength={claims.length}
            cardsPerRow={cardsPerRow}
            onTableScroll={handleScroll}
            onCardsScroll={handleCardsScroll}
          />
        </section>

        {/* Screen Reader Summary */}
        <div className="sr-only" aria-live="off" aria-label="Dashboard summary">
          <p>
            Claims Dashboard contains {claims.length} insurance claims{searchTerm ? `, showing ${filteredClaims.length} matching "${searchTerm}"` : ''}.
            Currently viewing in {viewMode} mode. Last updated:{' '}
            {new Date().toLocaleString()}.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ClaimsDashboard;
