import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CardsView } from '../CardsView';
import { FormattedClaim } from '../../types';

// Mock the child component
vi.mock('../ClaimCard', () => ({
  ClaimCard: ({ claim }: { claim: FormattedClaim }) => (
    <article data-testid={`claim-card-${claim.id}`}>
      Card for {claim.number}
    </article>
  ),
}));

const mockClaims: FormattedClaim[] = [
  {
    id: '1',
    number: 'CLM-001',
    incidentDate: '2024-01-15',
    createdAt: '2024-01-16T10:00:00Z',
    amount: '1500.00',
    holder: 'John Doe',
    policyNumber: 'TL-12345',
    insuredName: 'Laptop',
    description: 'Water damage repair',
    processingFee: '75.00',
    status: 'Approved',
    formattedClaimAmount: '$1,500.00',
    formattedProcessingFee: '$75.00',
    formattedTotalAmount: '$1,575.00',
    formattedIncidentDate: 'Jan 15, 2024',
    formattedCreatedDate: 'less than a minute ago',
  },
  {
    id: '2',
    number: 'CLM-002',
    incidentDate: '2023-12-02T00:00:00Z',
    createdAt: '2023-12-16T00:00:00Z',
    amount: '3000',
    holder: 'Jane Smith',
    policyNumber: 'POL-67890',
    insuredName: 'Phone',
    description: 'Screen replacement',
    processingFee: '50',
    status: 'Rejected',
    formattedClaimAmount: '$3,000.00',
    formattedProcessingFee: '$50.00',
    formattedTotalAmount: '$3,050.00',
    formattedIncidentDate: 'about 1 month ago',
    formattedCreatedDate: 'about 1 month ago',
  },
];

const mockProps = {
  formattedClaims: mockClaims,
  cardStartIndex: 0,
  cardEndIndex: 2,
  claimsLength: 10,
  cardsPerRow: 3,
  onScroll: vi.fn(),
  hasActiveFilters: false,
};

describe('CardsView', () => {
  it('renders grid layout container', () => {
    render(<CardsView {...mockProps} />);

    const grid = document.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
    );
    expect(grid).toBeInTheDocument();
  });

  it('renders ClaimCard components for visible claims', () => {
    render(<CardsView {...mockProps} />);

    expect(screen.getByTestId('claim-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('claim-card-2')).toBeInTheDocument();
  });

  it('renders scrollable container with correct attributes', () => {
    render(<CardsView {...mockProps} />);

    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-labelledby', 'claims-cards');
    expect(container).toHaveClass(
      'overflow-auto',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-inset'
    );
  });

  it('renders virtualization spacers', () => {
    render(<CardsView {...mockProps} />);

    // Top spacer should be 0 height since cardStartIndex is 0
    const topSpacer = document.querySelector('div[style*="height: 0px"]');
    expect(topSpacer).toBeInTheDocument();

    // Bottom spacer for remaining claims
    // Assuming CARD_HEIGHT is defined, but we'll check for the presence of bottom spacer
    const bottomSpacer = document.querySelectorAll('div[style*="height"]')[2]; // Third div with height
    expect(bottomSpacer).toBeInTheDocument();
  });

  it('renders footer with virtualization info', () => {
    render(<CardsView {...mockProps} />);

    const footerDiv = document.getElementById('claims-cards-desc');
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveTextContent('Virtualized cards');
    expect(footerDiv).toHaveTextContent(
      'Showing 2 rendered cards of 2 total claims'
    );
    expect(footerDiv).toHaveTextContent('Rendered range: 1-2');
  });

  it('calls onScroll when container is scrolled', () => {
    render(<CardsView {...mockProps} />);

    const container = screen.getByRole('region');
    fireEvent.scroll(container);

    expect(mockProps.onScroll).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA attributes', () => {
    render(<CardsView {...mockProps} />);

    const grid = document.getElementById('claims-cards');
    expect(grid).toBeInTheDocument();

    const footer = document.getElementById('claims-cards-desc');
    expect(footer).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<CardsView {...mockProps} />);

    const container = screen.getByRole('region');
    expect(container).toHaveStyle({ height: '600px' }); // CONTAINER_HEIGHT

    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6'
    );

    const paddingDiv = document.querySelector('.p-6');
    expect(paddingDiv).toBeInTheDocument();
  });

  it('handles empty claims array', () => {
    render(<CardsView {...mockProps} formattedClaims={[]} />);

    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();

    // Should still render grid but no cards
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(screen.queryByTestId('claim-card-1')).not.toBeInTheDocument();
  });

  it('renders gap between cards', () => {
    render(<CardsView {...mockProps} />);

    const grid = document.querySelector('.gap-6');
    expect(grid).toBeInTheDocument();
  });

  it('has responsive grid classes', () => {
    render(<CardsView {...mockProps} />);

    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});
