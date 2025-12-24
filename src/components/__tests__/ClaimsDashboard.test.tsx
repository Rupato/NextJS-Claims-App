import { render, screen } from '../../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ClaimsDashboard from '../ClaimsDashboard';
import { FormattedClaim } from '../../types/claims';

// Mock all the hooks
vi.mock('../../hooks/useClaimsQuery', () => ({
  useClaimsQuery: vi.fn(),
}));

vi.mock('../../hooks/useFormattedClaims', () => ({
  useFormattedClaims: vi.fn(),
}));

vi.mock('../../hooks/useTableVirtualization', () => ({
  useTableVirtualization: vi.fn(),
}));

vi.mock('../../hooks/useCardsVirtualization', () => ({
  useCardsVirtualization: vi.fn(),
}));

vi.mock('../../hooks/useSearch', () => ({
  useSearch: vi.fn(),
}));

vi.mock('../../utils/storage', () => ({
  usePersistedState: vi.fn(),
}));

// Define proper types for mock props
interface ViewModeTabsProps {
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

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

interface LoadingSkeletonProps {
  viewMode: 'table' | 'cards';
}

// Mock child components
vi.mock('../ViewModeTabs', () => ({
  ViewModeTabs: ({ viewMode, onViewModeChange }: ViewModeTabsProps) => (
    <div data-testid="view-mode-tabs">
      ViewModeTabs: {viewMode}
      <button onClick={() => onViewModeChange('cards')}>Switch to Cards</button>
    </div>
  ),
}));

vi.mock('../ClaimsView', () => ({
  ClaimsView: ({ viewMode }: ClaimsViewProps) => (
    <div data-testid="claims-view">ClaimsView: {viewMode}</div>
  ),
}));

vi.mock('../LoadingSkeleton', () => ({
  LoadingSkeleton: ({ viewMode }: LoadingSkeletonProps) => (
    <div data-testid="loading-skeleton">LoadingSkeleton: {viewMode}</div>
  ),
}));

import { useClaimsQuery } from '../../hooks/useClaimsQuery';
import { useFormattedClaims } from '../../hooks/useFormattedClaims';
import { useTableVirtualization } from '../../hooks/useTableVirtualization';
import { useCardsVirtualization } from '../../hooks/useCardsVirtualization';
import { useSearch } from '../../hooks/useSearch';
import { usePersistedState } from '../../utils/storage';

const mockUseClaimsQuery = vi.mocked(useClaimsQuery);
const mockUseFormattedClaims = vi.mocked(useFormattedClaims);
const mockUseTableVirtualization = vi.mocked(useTableVirtualization);
const mockUseCardsVirtualization = vi.mocked(useCardsVirtualization);
const mockUseSearch = vi.mocked(useSearch);
const mockUsePersistedState = vi.mocked(usePersistedState);

const mockClaims: FormattedClaim[] = [
  {
    id: '1',
    number: 'CLM-001',
    incidentDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    amount: '5000',
    holder: 'John Doe',
    policyNumber: 'POL-12345',
    processingFee: '100',
    status: 'Approved',
    formattedClaimAmount: '$5,000.00',
    formattedProcessingFee: '$100.00',
    formattedTotalAmount: '$5,100.00',
    formattedIncidentDate: 'about 1 month ago',
    formattedCreatedDate: 'less than a minute ago',
  },
];

describe('ClaimsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks - React Query structure
    mockUseClaimsQuery.mockReturnValue({
      data: mockClaims,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      isPending: false,
      isFetching: false,
      status: 'success',
    } as any);

    mockUseFormattedClaims.mockReturnValue(mockClaims);

    mockUseTableVirtualization.mockReturnValue({
      startIndex: 0,
      endIndex: 10,
      scrollTop: 0,
      handleScroll: vi.fn(),
    });

    mockUseCardsVirtualization.mockReturnValue({
      cardStartIndex: 0,
      cardEndIndex: 12,
      cardScrollTop: 0,
      handleCardsScroll: vi.fn(),
      cardsPerRow: 3,
    });

    mockUseSearch.mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      filteredClaims: mockClaims,
      isSearching: false,
    });

    mockUsePersistedState
      .mockReturnValueOnce(['table', vi.fn()]) // viewMode
      .mockReturnValueOnce([[], vi.fn()]) // selectedStatuses
      .mockReturnValueOnce(['created-newest', vi.fn()]); // sortOption
  });

  it('renders loading skeleton when loading', () => {
    mockUseClaimsQuery.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      isPending: true,
      isFetching: true,
      status: 'pending',
    } as any);

    render(<ClaimsDashboard />);

    expect(screen.getByText('Claims Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('View and manage all insurance claims')
    ).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.getByText('LoadingSkeleton: table')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    mockUseClaimsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Network error'),
      isError: true,
      isSuccess: false,
      isPending: false,
      isFetching: false,
      status: 'error',
    } as any);

    render(<ClaimsDashboard />);

    expect(
      screen.getByText('Error loading claims: Network error')
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders main dashboard when loaded successfully', () => {
    render(<ClaimsDashboard />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Claims Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('view-mode-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('claims-view')).toBeInTheDocument();
  });

  it('renders skip link for accessibility', () => {
    render(<ClaimsDashboard />);

    const skipLink = screen.getByRole('link', {
      name: /skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders screen reader instructions', () => {
    render(<ClaimsDashboard />);

    const nav = screen.getByRole('navigation', { name: /dashboard actions/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders live region for status updates', () => {
    render(<ClaimsDashboard />);

    const liveRegion = screen.getByText(
      'Displaying 1 of 1 insurance claims in table view'
    );
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('passes correct props to ViewModeTabs', () => {
    render(<ClaimsDashboard />);

    expect(screen.getByText('ViewModeTabs: table')).toBeInTheDocument();
  });

  it('passes correct props to ClaimsView', () => {
    render(<ClaimsDashboard />);

    expect(screen.getByText('ClaimsView: table')).toBeInTheDocument();
  });

  it('calls hooks with correct parameters', () => {
    render(<ClaimsDashboard />);

    expect(mockUseClaimsQuery).toHaveBeenCalledTimes(1);
    expect(mockUseSearch).toHaveBeenCalledWith(mockClaims);
    expect(mockUseFormattedClaims).toHaveBeenCalledWith(mockClaims);
    expect(mockUseTableVirtualization).toHaveBeenCalledWith(
      mockClaims.length,
      64
    );
    expect(mockUseCardsVirtualization).toHaveBeenCalledWith(
      mockClaims.length,
      'table',
      240
    );
    expect(mockUsePersistedState).toHaveBeenCalledWith(
      'claims-dashboard-view-mode',
      'table'
    );
  });

  it('renders main content section with correct attributes', () => {
    render(<ClaimsDashboard />);

    const mainContent = screen.getByRole('region', {
      name: /insurance claims data/i,
    });
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveAttribute('id', 'main-content');
  });

  it('renders screen reader summary', () => {
    render(<ClaimsDashboard />);

    const summary = document.querySelector('[aria-live="off"]');
    expect(summary).toBeInTheDocument();
  });

  it('has correct semantic structure', () => {
    render(<ClaimsDashboard />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /insurance claims data/i })
    ).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<ClaimsDashboard />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen', 'bg-gray-50', 'py-8');

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'bg-white',
      'shadow-sm',
      'rounded-lg',
      'overflow-hidden'
    );
  });

  it('renders dashboard title with correct id', () => {
    render(<ClaimsDashboard />);

    const title = screen.getByRole('heading', { name: 'Claims Dashboard' });
    expect(title).toHaveAttribute('id', 'dashboard-title');
  });

  it('renders nothing found message when search has no results', () => {
    mockUseSearch.mockReturnValue({
      searchTerm: 'nonexistent',
      setSearchTerm: vi.fn(),
      filteredClaims: [],
      isSearching: false,
    });

    render(<ClaimsDashboard />);

    expect(screen.getByText('Nothing found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No claims match "nonexistent". Try adjusting your search.'
      )
    ).toBeInTheDocument();

    // Should not render ClaimsView when no results
    expect(screen.queryByTestId('claims-view')).not.toBeInTheDocument();
  });
});
