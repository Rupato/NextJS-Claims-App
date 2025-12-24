'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersistedState, sortClaims } from '@/shared/utils';
import { useUrlArrayState, useUrlSortState } from '@/shared/hooks/useUrlState';
import { useClaimsQuery } from '@/features/claims-management/hooks/useClaimsQuery';
import { useFormattedClaims } from '@/features/claims-management/hooks/useFormattedClaims';
import { useTableVirtualization } from '@/shared/hooks/useTableVirtualization';
import { useCardsVirtualization } from '@/shared/hooks/useCardsVirtualization';
import { useSearch } from '@/shared/hooks/useSearch';
import { ViewModeTabs } from '@/shared/ui/ViewModeTabs';
import { SearchInput } from '@/shared/ui/SearchInput';
import StatusFilter from './StatusFilter';
import SortDropdown from '@/shared/ui/SortDropdown';
import { SortOption } from '@/shared/types';
import { ClaimsView } from '@/widgets/claims-table/ClaimsView';
import { LoadingSkeleton } from '@/shared/ui/LoadingSkeleton';
import { ClaimDetailsModal } from './ClaimDetailsModal';
import CreateClaimModal from './CreateClaimModal';
import { FormattedClaim, Claim } from '@/entities/claim/types';

// Column visibility management
interface ColumnConfig {
  key: keyof FormattedClaim;
  label: string;
  visible: boolean;
  sortable: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'number', label: 'Claim ID', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'holder', label: 'Holder', visible: true, sortable: true },
  { key: 'policyNumber', label: 'Policy #', visible: true, sortable: true },
  {
    key: 'formattedClaimAmount',
    label: 'Claim Amount',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedProcessingFee',
    label: 'Processing Fee',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedTotalAmount',
    label: 'Total Amount',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedIncidentDate',
    label: 'Incident Date',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedCreatedDate',
    label: 'Created Date',
    visible: true,
    sortable: true,
  },
];

interface ClaimsDashboardProps {
  initialClaims?: Claim[];
}

const ClaimsDashboard: React.FC<ClaimsDashboardProps> = ({ initialClaims }) => {
  const router = useRouter();
  const {
    data: claims = [],
    isLoading: loading,
    error,
    refetch,
  } = useClaimsQuery(initialClaims);

  // Type the error properly
  const errorMessage =
    error instanceof Error ? error.message : 'Unknown error occurred';

  // Force refetch when component mounts to ensure fresh data after navigation
  React.useEffect(() => {
    refetch()
      .then((result) => {
        console.log(
          '✅ CLIENT: Refetch complete, new data length:',
          result.data?.length || 0
        );
      })
      .catch((error) => {
        console.error('❌ CLIENT: Refetch failed:', error);
      });
  }, [refetch]); // Remove initialClaims from dependencies to always refetch
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>(
    'claims-dashboard-view-mode',
    'table'
  );
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by waiting for client-side mount
  React.useEffect(() => {
    setMounted(true);
  }, []);
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

  // Column visibility state - persisted in localStorage
  const [columnVisibility, setColumnVisibility] = usePersistedState<
    Record<string, boolean>
  >(
    'claims-dashboard-column-visibility',
    DEFAULT_COLUMNS.reduce(
      (acc, col) => ({ ...acc, [col.key]: col.visible }),
      {}
    )
  );

  // Modal state for claim details
  const [selectedClaim, setSelectedClaim] = useState<FormattedClaim | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal state for create claim form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Column visibility menu state
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

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
  const hasActiveFilters = selectedStatuses.length > 0 || !!searchTerm;
  const rowHeight = hasActiveFilters ? 48 : 64;
  const cardHeight = hasActiveFilters ? 200 : 240;

  // Determine aria-describedby based on view mode
  const ariaDescribedBy = mounted
    ? viewMode === 'table'
      ? 'claims-table-desc claims-table-instructions'
      : 'claims-cards-desc claims-cards-instructions'
    : 'claims-table-desc claims-table-instructions';

  // Determine if we should show "nothing found" state
  const shouldShowEmptyState =
    filteredClaims.length === 0 && (searchTerm || selectedStatuses.length > 0);

  // Determine empty state message
  const getEmptyStateMessage = () => {
    if (searchTerm && selectedStatuses.length > 0) {
      return `No claims match "${searchTerm}" with the selected status filters.`;
    }
    if (searchTerm) {
      return `No claims match "${searchTerm}". Try adjusting your search.`;
    }
    return 'No claims found with the selected status filters. Try adjusting your filters.';
  };

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
        <div className="text-center">
          <div
            className="text-lg text-red-600 mb-4"
            role="alert"
            aria-live="assertive"
          >
            Error loading claims: {errorMessage}
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Retry loading claims"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
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
                {mounted && (
                  <ViewModeTabs
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                )}
                <button
                  onClick={() => router.push('/claims/new')}
                  className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap min-w-fit"
                >
                  <svg
                    className="mr-2 h-5 w-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Claim
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Status Filter, Sort, and Column Visibility */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            {mounted && (
              <StatusFilter
                selectedStatuses={selectedStatuses}
                onStatusChange={setSelectedStatuses}
                availableStatuses={availableStatuses}
              />
            )}
          </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* Column Visibility Toggle */}
            {viewMode === 'table' && mounted && (
              <div className="relative">
                <button
                  onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-haspopup="menu"
                  aria-expanded={isColumnMenuOpen}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  Columns
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isColumnMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-1">
                      {DEFAULT_COLUMNS.map((column) => (
                        <label
                          key={column.key}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              columnVisibility[column.key] ?? column.visible
                            }
                            onChange={(e) => {
                              setColumnVisibility((prev) => ({
                                ...prev,
                                [column.key]: e.target.checked,
                              }));
                            }}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {column.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mounted && (
              <SortDropdown value={sortOption} onChange={setSortOption} />
            )}
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
        {mounted && (
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="dashboard-status"
          >
            {filteredClaims.length > 0 &&
              `Displaying ${filteredClaims.length} of ${claims.length} insurance claims in ${viewMode} view${searchTerm ? ` matching "${searchTerm}"` : ''}`}
          </div>
        )}

        <section
          id="main-content"
          className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden"
          aria-labelledby="claims-section-title"
          aria-describedby={ariaDescribedBy}
        >
          <div className="sr-only">
            <h2 id="claims-section-title">Insurance Claims Data</h2>
            <div id="claims-table-instructions">
              Table view: Click rows or use ↑↓ arrow keys to navigate, Enter to
              view details. Virtualized for performance.
            </div>
            <div id="claims-cards-instructions">
              Cards view: Click cards or use Tab to navigate, Enter to view
              details. Virtualized grid.
            </div>
          </div>

          {shouldShowEmptyState ? (
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
                {getEmptyStateMessage()}
              </p>
            </div>
          ) : (
            mounted && (
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
                columnVisibility={columnVisibility}
                onColumnSort={setSortOption}
                currentSort={sortOption}
              />
            )
          )}
        </section>

        {/* Screen Reader Summary */}
        <div className="sr-only" aria-live="off" aria-label="Dashboard summary">
          <p>Claims Dashboard contains insurance claims.</p>
        </div>
      </div>

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Create Claim Modal */}
      <CreateClaimModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </main>
  );
};

export default ClaimsDashboard;
