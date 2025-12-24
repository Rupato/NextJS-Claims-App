'use client';

import React, { useState } from 'react';
import { usePersistedState } from '../utils/storage';
import { useUrlArrayState, useUrlSortState } from '../hooks/useUrlState';
import { useClaimsQuery } from '../hooks/useClaimsQuery';
import { useFormattedClaims } from '../hooks/useFormattedClaims';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import { useCardsVirtualization } from '../hooks/useCardsVirtualization';
import { useSearch } from '../hooks/useSearch';
import { sortClaims } from '../utils/sorting';
import { ViewModeTabs } from './ViewModeTabs';
import { SearchInput } from './SearchInput';
import StatusFilter from './StatusFilter';
import SortDropdown, { SortOption } from './SortDropdown';
import { ClaimsView } from './ClaimsView';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ClaimDetailsModal } from './ClaimDetailsModal';
import { FormattedClaim } from '../types/claims';

const ClaimsDashboard: React.FC = () => {
  const { data: claims = [], isLoading: loading, error } = useClaimsQuery();
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>(
    'claims-dashboard-view-mode',
    'table'
  );
  const [selectedStatuses, setSelectedStatuses] = useUrlArrayState(
    'status',
    []
  );
  const [sortOption, setSortOption] = useUrlSortState(
    'sort',
    'created-newest'
  ) as [
    SortOption,
    (value: SortOption | ((prev: SortOption) => SortOption)) => void,
  ];
  // Modal state for claim details
  const [selectedClaim, setSelectedClaim] = useState<FormattedClaim | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowSelect = (claim: FormattedClaim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClaim(null);
  };

  // Get available statuses from claims data
  const availableStatuses = React.useMemo(() => {
    const statusSet = new Set(claims.map((claim) => claim.status));
    return Array.from(statusSet).sort();
  }, [claims]);

  // Filter claims by selected statuses first
  const statusFilteredClaims = React.useMemo(() => {
    if (selectedStatuses.length === 0) {
      return claims;
    }
    return claims.filter((claim) => selectedStatuses.includes(claim.status));
  }, [claims, selectedStatuses]);

  // Sort claims (applied after status filtering)
  const sortedClaims = React.useMemo(() => {
    return sortClaims(statusFilteredClaims, sortOption);
  }, [statusFilteredClaims, sortOption]);

  // Search functionality (applied after sorting)
  const { filteredClaims, isSearching, searchTerm, setSearchTerm } =
    useSearch(sortedClaims);

  // Determine row/card height based on active filters
  const rowHeight = selectedStatuses.length > 0 || !!searchTerm ? 48 : 64;
  const cardHeight = selectedStatuses.length > 0 || !!searchTerm ? 200 : 240;

  // Always call hooks in same order (Rules of Hooks)
  const formattedClaims = useFormattedClaims(filteredClaims);
  const { startIndex, endIndex, handleScroll } = useTableVirtualization(
    filteredClaims.length,
    rowHeight
  );
  const { cardStartIndex, cardEndIndex, handleCardsScroll, cardsPerRow } =
    useCardsVirtualization(filteredClaims.length, viewMode, cardHeight);

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
          Error loading claims: {error.message || 'Unknown error occurred'}
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

        {/* Status Filter and Sort */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="sm:w-auto">
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        {/* Screen Reader Navigation Instructions */}
        <nav aria-label="Dashboard actions" className="sr-only">
          <p>
            Use Tab to navigate through the claims table. Use ↑↓ arrow keys to
            navigate rows, Enter to open claim details. Use Tab to navigate
            between view modes.
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
              Table view: Click rows or use ↑↓ arrow keys to navigate, Enter to
              view details. Virtualized for performance with{' '}
              {filteredClaims.length} of {claims.length} claims shown
              {searchTerm ? ` matching "${searchTerm}"` : ''}.
            </div>
            <div id="claims-cards-instructions">
              Cards view: Click cards or use Tab to navigate, Enter to view
              details. Virtualized grid with {filteredClaims.length} of{' '}
              {claims.length} claims shown
              {searchTerm ? ` matching "${searchTerm}"` : ''}.
            </div>
          </div>

          {filteredClaims.length === 0 &&
          (searchTerm || selectedStatuses.length > 0) ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nothing found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm && selectedStatuses.length > 0
                  ? `No claims match "${searchTerm}" with the selected status filters.`
                  : searchTerm
                    ? `No claims match "${searchTerm}". Try adjusting your search.`
                    : `No claims found with the selected status filters. Try adjusting your filters.`}
              </p>
            </div>
          ) : (
            <ClaimsView
              viewMode={viewMode}
              formattedClaims={formattedClaims}
              startIndex={startIndex}
              endIndex={endIndex}
              cardStartIndex={cardStartIndex}
              cardEndIndex={cardEndIndex}
              cardsPerRow={cardsPerRow}
              onTableScroll={handleScroll}
              onCardsScroll={handleCardsScroll}
              hasActiveFilters={selectedStatuses.length > 0 || !!searchTerm}
              onRowSelect={handleRowSelect}
            />
          )}
        </section>

        {/* Screen Reader Summary */}
        <div className="sr-only" aria-live="off" aria-label="Dashboard summary">
          <p>
            Claims Dashboard contains {claims.length} insurance claims
            {searchTerm
              ? `, showing ${filteredClaims.length} matching "${searchTerm}"`
              : ''}
            . Currently viewing in {viewMode} mode. Last updated:{' '}
            {new Date().toLocaleString()}.
          </p>
        </div>
      </div>

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};

export default ClaimsDashboard;
