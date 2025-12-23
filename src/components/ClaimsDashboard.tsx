'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { Claim } from '../types/claims';
import { formatCurrency } from '../utils/formatters';
import { usePersistedState } from '../utils/storage';
import { ClaimCard } from './ClaimCard';
import { ViewModeTabs } from './ViewModeTabs';
import { ClaimsView } from './ClaimsView';
import {
  ROW_HEIGHT,
  BUFFER_SIZE,
  CONTAINER_HEIGHT,
  CARDS_PER_ROW,
  CARD_HEIGHT,
  CARD_BUFFER_SIZE,
} from '../constants/virtualization';
import { formatDistanceToNow, parseISO } from 'date-fns';

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
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = usePersistedState<'table' | 'cards'>('claims-dashboard-view-mode', 'table');

  // Table virtualization state
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20); // Show 20 rows initially
  const [scrollTop, setScrollTop] = useState(0);

  // Cards virtualization state (scroll-based like table)
  const [cardStartIndex, setCardStartIndex] = useState(0);
  const [cardEndIndex, setCardEndIndex] = useState(12); // Show 12 cards initially
  const [cardScrollTop, setCardScrollTop] = useState(0);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Calculate visible cards range based on scroll position
  const updateVisibleCardsRange = useCallback(
    (scrollTop: number) => {
      const visibleStart = Math.floor(scrollTop / CARD_HEIGHT) * CARDS_PER_ROW;
      const visibleEnd = Math.min(
        visibleStart +
          Math.ceil(CONTAINER_HEIGHT / CARD_HEIGHT) * CARDS_PER_ROW +
          CARD_BUFFER_SIZE,
        claims.length
      );

      // Add buffer zones
      const bufferedStart = Math.max(0, visibleStart - CARD_BUFFER_SIZE);
      const bufferedEnd = Math.min(
        claims.length,
        visibleEnd + CARD_BUFFER_SIZE
      );

      setCardStartIndex(bufferedStart);
      setCardEndIndex(bufferedEnd);
      setCardScrollTop(scrollTop);
    },
    [claims.length]
  );

  // Handle cards scroll events
  const handleCardsScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      updateVisibleCardsRange(scrollTop);
    },
    [updateVisibleCardsRange]
  );

  // Initialize cards visible range
  useEffect(() => {
    if (claims.length > 0 && viewMode === 'cards') {
      updateVisibleCardsRange(0);
    }
  }, [claims.length, viewMode, updateVisibleCardsRange]);

  // Calculate visible range based on scroll position
  const updateVisibleRange = useCallback(
    (scrollTop: number) => {
      const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
      const visibleEnd = Math.min(
        visibleStart + Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + BUFFER_SIZE,
        claims.length
      );

      // Add buffer zones
      const bufferedStart = Math.max(0, visibleStart - BUFFER_SIZE);
      const bufferedEnd = Math.min(claims.length, visibleEnd + BUFFER_SIZE);

      setStartIndex(bufferedStart);
      setEndIndex(bufferedEnd);
      setScrollTop(scrollTop);
    },
    [claims.length]
  );

  // Handle scroll events
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      updateVisibleRange(scrollTop);
    },
    [updateVisibleRange]
  );

  // Initialize visible range
  useEffect(() => {
    if (claims.length > 0) {
      updateVisibleRange(0);
    }
  }, [claims.length, updateVisibleRange]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // Add cache control for better performance
        const response = await fetch('http://localhost:8001/api/v1/claims', {
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClaims(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch claims');
        console.error('Error fetching claims:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Memoize formatted data for performance
  const formattedClaims = useMemo(() => {
    return claims.map((claim) => {
      const claimAmount = parseFloat(claim.amount);
      const processingFee = parseFloat(claim.processingFee);
      const totalAmount = claimAmount + processingFee;

      return {
        ...claim,
        formattedClaimAmount: formatCurrency(claim.amount),
        formattedProcessingFee: formatCurrency(claim.processingFee),
        formattedTotalAmount: formatCurrency(totalAmount.toString()),
        formattedIncidentDate: formatDistanceToNow(
          parseISO(claim.incidentDate),
          { addSuffix: true }
        ),
        formattedCreatedDate: formatDistanceToNow(parseISO(claim.createdAt), {
          addSuffix: true,
        }),
      };
    });
  }, [claims]);

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
