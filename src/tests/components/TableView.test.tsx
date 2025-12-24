import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TableView } from '../TableView';
import { FormattedClaim } from '../../types';

// Mock the child components
vi.mock('../TableHeader', () => ({
  TableHeader: () => (
    <thead data-testid="table-header">
      <tr>
        <th>Mock Header</th>
      </tr>
    </thead>
  ),
}));

vi.mock('../TableRow', () => ({
  TableRow: ({ claim }: { claim: FormattedClaim }) => (
    <tr data-testid={`table-row-${claim.id}`}>
      <td>Row for {claim.number}</td>
    </tr>
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
    insuredName: 'Car',
    description: 'Accident repair',
    processingFee: '100',
    status: 'Approved',
    formattedClaimAmount: '$5,000.00',
    formattedProcessingFee: '$100.00',
    formattedTotalAmount: '$5,100.00',
    formattedIncidentDate: 'about 1 month ago',
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
  startIndex: 0,
  endIndex: 2,
  onScroll: vi.fn(),
  hasActiveFilters: false,
};

describe('TableView', () => {
  it('renders table with correct structure', () => {
    render(<TableView {...mockProps} />);

    const table = screen.getByRole('table', {
      name: /insurance claims data table/i,
    });
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-rowcount', '3'); // +1 for header
    expect(table).toHaveAttribute('aria-colcount', '9');
  });

  it('renders TableHeader component', () => {
    render(<TableView {...mockProps} />);

    expect(screen.getByTestId('table-header')).toBeInTheDocument();
  });

  it('renders TableRow components for visible claims', () => {
    render(<TableView {...mockProps} />);

    expect(screen.getByTestId('table-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-2')).toBeInTheDocument();
  });

  it('renders tbody with correct role', () => {
    render(<TableView {...mockProps} />);

    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups.find((rg) => rg.tagName === 'TBODY');
    expect(tbody).toBeInTheDocument();
  });

  it('renders virtualization spacers', () => {
    render(<TableView {...mockProps} />);

    // Check that the component renders with virtualization-related elements
    const scrollableContainer = screen.getByRole('region');

    // The container should have children (table, spacers, etc.)
    expect(scrollableContainer.children.length).toBeGreaterThan(0);

    // Check that there are div elements with height styles (spacers)
    const spacers = document.querySelectorAll('div[style*="height"]');
    expect(spacers.length).toBeGreaterThan(0);
  });

  it('renders scrollable container with correct attributes', () => {
    render(<TableView {...mockProps} />);

    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      'overflow-auto',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-inset'
    );
  });

  it('renders footer with virtualization info', () => {
    render(<TableView {...mockProps} />);

    const footerDiv = document.getElementById('claims-table-desc');
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveTextContent('Virtualized table');
    expect(footerDiv).toHaveTextContent(
      'Showing 2 rendered rows of 2 total claims'
    );
    expect(footerDiv).toHaveTextContent('Rendered range: 1-2');
  });

  it('calls onScroll when container is scrolled', () => {
    render(<TableView {...mockProps} />);

    const container = screen.getByRole('region');
    fireEvent.scroll(container);

    expect(mockProps.onScroll).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA attributes', () => {
    render(<TableView {...mockProps} />);

    const heading = document.getElementById('claims-table');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Insurance Claims Data Table');

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-labelledby', 'claims-table');

    const footer = document.getElementById('claims-table-desc');
    expect(footer).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<TableView {...mockProps} />);

    const table = screen.getByRole('table');
    expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');

    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups.find((rg) => rg.tagName === 'TBODY');
    expect(tbody).toHaveClass('bg-white', 'divide-y', 'divide-gray-200');
  });

  it('handles empty claims array', () => {
    render(<TableView {...mockProps} formattedClaims={[]} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Should still render header but no rows
    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.queryByTestId('table-row-1')).not.toBeInTheDocument();
  });
});
