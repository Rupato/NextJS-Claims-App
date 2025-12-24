import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClaimCard } from '../ClaimCard';
import { FormattedClaim } from '../../types';

const mockClaim: FormattedClaim = {
  id: '1',
  number: 'CLM-001',
  incidentDate: '2023-12-01',
  createdAt: '2023-12-15',
  amount: '1500.00',
  holder: 'John Doe',
  policyNumber: 'POL-12345',
  insuredName: 'Car Insurance',
  description: 'Car accident claim',
  processingFee: '75.00',
  status: 'Approved',
  formattedClaimAmount: '$5,000.00',
  formattedProcessingFee: '$100.00',
  formattedTotalAmount: '$5,100.00',
  formattedIncidentDate: 'about 1 month ago',
  formattedCreatedDate: 'less than a minute ago',
};

describe('ClaimCard', () => {
  it('renders claim data correctly', () => {
    render(<ClaimCard claim={mockClaim} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('CLM-001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('POL-12345')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$5,100.00')).toBeInTheDocument();
    expect(screen.getByText('about 1 month ago')).toBeInTheDocument();
    expect(screen.getByText('less than a minute ago')).toBeInTheDocument();
  });

  it('applies correct status color classes for Approved status', () => {
    render(<ClaimCard claim={mockClaim} />);

    const statusSpan = screen.getByText('Approved');
    expect(statusSpan).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies correct status color classes for different statuses', () => {
    const statuses = ['Rejected', 'Submitted', 'Processed', 'Completed'];

    statuses.forEach((status) => {
      const claim = { ...mockClaim, status };
      const { rerender } = render(<ClaimCard claim={claim} />);

      const statusSpan = screen.getByText(status);
      if (status === 'Rejected') {
        expect(statusSpan).toHaveClass('bg-red-100', 'text-red-800');
      } else if (status === 'Submitted') {
        expect(statusSpan).toHaveClass('bg-yellow-100', 'text-yellow-800');
      } else if (status === 'Processed') {
        expect(statusSpan).toHaveClass('bg-blue-100', 'text-blue-800');
      } else if (status === 'Completed') {
        expect(statusSpan).toHaveClass('bg-purple-100', 'text-purple-800');
      }

      rerender(<ClaimCard claim={{ ...mockClaim, status: 'Approved' }} />);
    });
  });

  it('has correct ARIA attributes', () => {
    render(<ClaimCard claim={mockClaim} />);

    const statusSpan = screen.getByLabelText('Status: Approved');
    expect(statusSpan).toBeInTheDocument();
  });

  it('renders time elements with dateTime attributes', () => {
    render(<ClaimCard claim={mockClaim} />);

    const incidentTime = screen.getByText('about 1 month ago');
    expect(incidentTime).toHaveAttribute('dateTime');

    const createdTime = screen.getByText('less than a minute ago');
    expect(createdTime).toHaveAttribute('dateTime');
  });

  it('applies hover and transition classes', () => {
    render(<ClaimCard claim={mockClaim} />);

    const article = screen.getByRole('article');
    expect(article).toHaveClass('hover:shadow-md', 'transition-shadow');
  });

  it('renders definition lists correctly', () => {
    render(<ClaimCard claim={mockClaim} />);

    // Check dt and dd elements
    expect(screen.getByText('Policy Number')).toBeInTheDocument();
    expect(screen.getByText('Claim Amount')).toBeInTheDocument();
    expect(screen.getByText('Processing Fee')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
  });

  it('has correct semantic structure', () => {
    render(<ClaimCard claim={mockClaim} />);

    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();

    const header = article.querySelector('header');
    expect(header).toBeInTheDocument();

    const footer = article.querySelector('.border-t');
    expect(footer).toBeInTheDocument();
  });

  it('displays total amount with bold styling', () => {
    render(<ClaimCard claim={mockClaim} />);

    const totalAmount = screen.getByText('$5,100.00');
    expect(totalAmount).toHaveClass('text-lg', 'font-bold');
  });
});
