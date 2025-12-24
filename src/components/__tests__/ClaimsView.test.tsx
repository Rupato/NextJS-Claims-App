import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClaimsView } from '../ClaimsView';
import { FormattedClaim } from '../../types/claims';

// Define proper types for mock props
interface TableViewProps {
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  claimsLength: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

interface CardsViewProps {
  formattedClaims: FormattedClaim[];
  cardStartIndex: number;
  cardEndIndex: number;
  claimsLength: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

// Mock the child components
vi.mock('../TableView', () => ({
  TableView: ({ formattedClaims, startIndex, endIndex }: TableViewProps) => (
    <div data-testid="table-view">
      TableView: {formattedClaims.length} claims, {startIndex}-{endIndex}
    </div>
  ),
}));

vi.mock('../CardsView', () => ({
  CardsView: ({
    formattedClaims,
    cardStartIndex,
    cardEndIndex,
  }: CardsViewProps) => (
    <div data-testid="cards-view">
      CardsView: {formattedClaims.length} claims, {cardStartIndex}-
      {cardEndIndex}
    </div>
  ),
}));

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

const mockProps = {
  formattedClaims: mockClaims,
  startIndex: 0,
  endIndex: 2,
  cardStartIndex: 0,
  cardEndIndex: 3,
  cardsPerRow: 3,
  onTableScroll: vi.fn(),
  onCardsScroll: vi.fn(),
  hasActiveFilters: false,
};

describe('ClaimsView', () => {
  it('renders TableView when viewMode is "table"', () => {
    render(<ClaimsView {...mockProps} viewMode="table" />);

    expect(screen.getByTestId('table-view')).toBeInTheDocument();
    expect(screen.queryByTestId('cards-view')).not.toBeInTheDocument();
  });

  it('renders CardsView when viewMode is "cards"', () => {
    render(<ClaimsView {...mockProps} viewMode="cards" />);

    expect(screen.getByTestId('cards-view')).toBeInTheDocument();
    expect(screen.queryByTestId('table-view')).not.toBeInTheDocument();
  });

  it('passes correct props to TableView', () => {
    render(<ClaimsView {...mockProps} viewMode="table" />);

    const tableView = screen.getByTestId('table-view');
    expect(tableView).toHaveTextContent('TableView: 1 claims, 0-2');
  });

  it('passes correct props to CardsView', () => {
    render(<ClaimsView {...mockProps} viewMode="cards" />);

    const cardsView = screen.getByTestId('cards-view');
    expect(cardsView).toHaveTextContent('CardsView: 1 claims, 0-3');
  });

  it('switches between views when viewMode changes', () => {
    const { rerender } = render(<ClaimsView {...mockProps} viewMode="table" />);

    expect(screen.getByTestId('table-view')).toBeInTheDocument();

    rerender(<ClaimsView {...mockProps} viewMode="cards" />);

    expect(screen.getByTestId('cards-view')).toBeInTheDocument();
    expect(screen.queryByTestId('table-view')).not.toBeInTheDocument();
  });
});
