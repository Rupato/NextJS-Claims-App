import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Claim {
  id: number;
  number: string;
  incidentDate: string;
  createdAt: string;
  amount: string;
  holder: string;
  policyNumber: string;
  processingFee: string;
  status: string;
}

// Memoized currency formatter for performance
const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
};

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
  const [visibleRows, setVisibleRows] = useState(20); // Start with 20 rows for better performance
  const [loadingMore, setLoadingMore] = useState(false);

  // Load more rows function
  const loadMoreRows = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleRows(prev => Math.min(prev + 20, claims.length));
      setLoadingMore(false);
    }, 300);
  };

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
        formattedIncidentDate: formatDistanceToNow(parseISO(claim.incidentDate), { addSuffix: true }),
        formattedCreatedDate: formatDistanceToNow(parseISO(claim.createdAt), { addSuffix: true }),
      };
    });
  }, [claims]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Claims Dashboard</h1>
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
    <main className="min-h-screen bg-gray-50 py-8" role="main" aria-labelledby="dashboard-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="bg-white shadow-sm rounded-lg overflow-hidden" role="banner">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 id="dashboard-title" className="text-2xl font-bold text-gray-900">Claims Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600" id="dashboard-description">
              View and manage all insurance claims
            </p>
          </div>
        </header>

        <nav aria-label="Dashboard actions" className="sr-only">
          <p>Use Tab to navigate through the claims table. Use Enter or Space to interact with focusable elements.</p>
        </nav>

        <section className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden" aria-labelledby="claims-section-title" aria-describedby="claims-table-desc">
          <div className="sr-only">
            <h2 id="claims-section-title">Insurance Claims Data</h2>
          </div>

          <div
            className="overflow-x-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-md"
            role="region"
            aria-labelledby="claims-table"
            aria-describedby="claims-table-desc"
            tabIndex={0}
            aria-label="Claims data table container - use arrow keys to navigate"
          >
            <table
              className="min-w-full divide-y divide-gray-200"
              role="table"
              aria-label="Insurance claims data table showing claim ID, status, holder name, policy number, claim amount, processing fee, total amount, and dates"
              aria-rowcount={formattedClaims.length + 1}
              aria-colcount={9}
              id="claims-table"
            >
              <thead className="bg-gray-50">
                <tr role="row">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Claim ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Holder Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Policy Number
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Claim Amount
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Processing Fee
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Total Amount
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Incident Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    role="columnheader"
                    scope="col"
                  >
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
                {formattedClaims.slice(0, visibleRows).map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50" role="row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" role="cell">
                      {claim.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" role="cell">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          claim.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : claim.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : claim.status === 'Submitted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : claim.status === 'Processed'
                            ? 'bg-blue-100 text-blue-800'
                            : claim.status === 'Completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        aria-label={`Status: ${claim.status}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" role="cell">
                      {claim.holder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" role="cell">
                      {claim.policyNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" role="cell">
                      {claim.formattedClaimAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" role="cell">
                      {claim.formattedProcessingFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" role="cell">
                      {claim.formattedTotalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                      <time dateTime={claim.incidentDate}>
                        {claim.formattedIncidentDate}
                      </time>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                      <time dateTime={claim.createdAt}>
                        {claim.formattedCreatedDate}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50" id="claims-table-desc">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Showing {visibleRows} of {claims.length} insurance claims with status, amounts, and dates.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
              {visibleRows < claims.length && (
                <button
                  onClick={loadMoreRows}
                  disabled={loadingMore}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Load ${Math.min(20, claims.length - visibleRows)} more claims`}
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    `Load ${Math.min(20, claims.length - visibleRows)} More`
                  )}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ClaimsDashboard;
