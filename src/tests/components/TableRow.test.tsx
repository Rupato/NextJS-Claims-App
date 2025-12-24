import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableRow } from '@/entities/claim/ui/TableRow';
import { FormattedClaim } from '@/entities/claim/types';

const mockClaim: FormattedClaim = {
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
};

describe('TableRow', () => {
  it('renders claim data correctly', () => {
    render(<TableRow claim={mockClaim} />);

    expect(screen.getByText('CLM-001')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('POL-12345')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$5,100.00')).toBeInTheDocument();
    expect(screen.getByText('about 1 month ago')).toBeInTheDocument();
    expect(screen.getByText('less than a minute ago')).toBeInTheDocument();
  });

  it('applies correct status color classes for Approved status', () => {
    render(<TableRow claim={mockClaim} />);

    const statusSpan = screen.getByText('Approved');
    expect(statusSpan).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies correct status color classes for Rejected status', () => {
    const rejectedClaim = { ...mockClaim, status: 'Rejected' };
    render(<TableRow claim={rejectedClaim} />);

    const statusSpan = screen.getByText('Rejected');
    expect(statusSpan).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('applies correct status color classes for Submitted status', () => {
    const submittedClaim = { ...mockClaim, status: 'Submitted' };
    render(<TableRow claim={submittedClaim} />);

    const statusSpan = screen.getByText('Submitted');
    expect(statusSpan).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('applies correct status color classes for Processed status', () => {
    const processedClaim = { ...mockClaim, status: 'Processed' };
    render(<TableRow claim={processedClaim} />);

    const statusSpan = screen.getByText('Processed');
    expect(statusSpan).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('applies correct status color classes for Completed status', () => {
    const completedClaim = { ...mockClaim, status: 'Completed' };
    render(<TableRow claim={completedClaim} />);

    const statusSpan = screen.getByText('Completed');
    expect(statusSpan).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('applies default status color classes for unknown status', () => {
    const unknownClaim = { ...mockClaim, status: 'Unknown' };
    render(<TableRow claim={unknownClaim} />);

    const statusSpan = screen.getByText('Unknown');
    expect(statusSpan).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('has correct ARIA attributes for accessibility', () => {
    render(<TableRow claim={mockClaim} />);

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(9);

    const statusSpan = screen.getByLabelText('Status: Approved');
    expect(statusSpan).toBeInTheDocument();
  });

  it('renders time elements with correct dateTime attributes', () => {
    render(<TableRow claim={mockClaim} />);

    const incidentTime = screen.getByText('about 1 month ago');
    expect(incidentTime).toHaveAttribute('dateTime', '2023-12-01T00:00:00Z');

    const createdTime = screen.getByText('less than a minute ago');
    expect(createdTime).toHaveAttribute('dateTime', '2023-12-15T00:00:00Z');
  });

  it('applies hover styles', () => {
    render(<TableRow claim={mockClaim} />);

    const row = screen.getByRole('row');
    expect(row).toHaveClass('hover:bg-gray-50');
  });
});
