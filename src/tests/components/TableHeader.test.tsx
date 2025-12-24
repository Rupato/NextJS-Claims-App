import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableHeader } from '../TableHeader';

describe('TableHeader', () => {
  it('renders all table headers correctly', () => {
    render(<TableHeader />);

    const headers = [
      'Claim ID',
      'Status',
      'Holder Name',
      'Policy Number',
      'Claim Amount',
      'Processing Fee',
      'Total Amount',
      'Incident Date',
      'Created Date',
    ];

    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders thead with correct role', () => {
    render(<TableHeader />);

    const thead = screen.getByRole('rowgroup');
    expect(thead).toBeInTheDocument();
    expect(thead.tagName).toBe('THEAD');
  });

  it('renders th elements with correct roles and scope', () => {
    render(<TableHeader />);

    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(9);

    columnHeaders.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
      expect(header.tagName).toBe('TH');
    });
  });

  it('applies correct CSS classes', () => {
    render(<TableHeader />);

    const thead = document.querySelector('thead');
    expect(thead).toHaveClass('bg-gray-50');

    const headers = screen.getAllByRole('columnheader');
    headers.forEach((header) => {
      expect(header).toHaveClass(
        'px-6',
        'py-3',
        'text-left',
        'text-xs',
        'font-medium',
        'text-gray-500',
        'uppercase',
        'tracking-wider'
      );
    });
  });

  it('renders headers in correct order', () => {
    render(<TableHeader />);

    const headers = screen.getAllByRole('columnheader');
    const expectedHeaders = [
      'Claim ID',
      'Status',
      'Holder Name',
      'Policy Number',
      'Claim Amount',
      'Processing Fee',
      'Total Amount',
      'Incident Date',
      'Created Date',
    ];

    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]);
    });
  });

  it('renders exactly one row', () => {
    render(<TableHeader />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
