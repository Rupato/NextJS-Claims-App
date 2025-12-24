import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  describe('table view mode', () => {
    it('renders table skeleton structure', () => {
      render(<LoadingSkeleton viewMode="table" />);

      const container = document.querySelector('.animate-pulse');
      expect(container).toBeInTheDocument();

      // Check for table header skeleton
      const headerSkeleton = document.querySelector('.bg-gray-50.border-b');
      expect(headerSkeleton).toBeInTheDocument();

      // Check for 9 header skeleton elements
      const headerElements = document.querySelectorAll(
        '.bg-gray-50.border-b .h-4'
      );
      expect(headerElements).toHaveLength(9);

      // Check for table rows skeleton (15 rows)
      const rowSkeletons = document.querySelectorAll(
        '.border-b.border-gray-100'
      );
      expect(rowSkeletons).toHaveLength(15);

      // Check each row has 9 skeleton elements
      rowSkeletons.forEach((row) => {
        const elements = row.querySelectorAll('.h-4');
        expect(elements).toHaveLength(9);
      });

      // Check for footer skeleton
      const footerSkeleton = document.querySelector(
        '.border-t.border-gray-200.bg-gray-50'
      );
      expect(footerSkeleton).toBeInTheDocument();
    });

    it('applies animate-pulse class', () => {
      render(<LoadingSkeleton viewMode="table" />);

      const pulseContainer = document.querySelector('.animate-pulse');
      expect(pulseContainer).toBeInTheDocument();
    });

    it('has correct padding', () => {
      render(<LoadingSkeleton viewMode="table" />);

      const container = document.querySelector('.p-6');
      expect(container).toBeInTheDocument();
    });
  });

  describe('cards view mode', () => {
    it('renders cards skeleton structure', () => {
      render(<LoadingSkeleton viewMode="cards" />);

      // Check for grid layout
      const grid = document.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(grid).toBeInTheDocument();

      // Check for 12 card skeletons
      const cards = document.querySelectorAll('article');
      expect(cards).toHaveLength(12);

      // Check each card structure
      cards.forEach((card) => {
        expect(card).toHaveClass(
          'bg-white',
          'border',
          'border-gray-200',
          'rounded-lg',
          'p-6'
        );

        // Check header
        const header = card.querySelector('header');
        expect(header).toBeInTheDocument();

        // Check content grid
        const contentGrid = card.querySelector('.grid.grid-cols-2');
        expect(contentGrid).toBeInTheDocument();

        // Check 4 content sections
        const contentSections = contentGrid?.querySelectorAll('.space-y-2');
        expect(contentSections).toHaveLength(4);

        // Check footer
        const footer = card.querySelector('.border-t.border-gray-200');
        expect(footer).toBeInTheDocument();
      });

      // Check for cards footer skeleton
      const footerSkeleton = document.querySelectorAll(
        '.border-t.border-gray-200.bg-gray-50'
      );
      expect(footerSkeleton).toHaveLength(1);
    });

    it('applies animate-pulse class', () => {
      render(<LoadingSkeleton viewMode="cards" />);

      const pulseContainer = document.querySelector('.animate-pulse');
      expect(pulseContainer).toBeInTheDocument();
    });

    it('has correct padding', () => {
      render(<LoadingSkeleton viewMode="cards" />);

      const container = document.querySelector('.p-6');
      expect(container).toBeInTheDocument();
    });
  });

  it('renders different structures for different view modes', () => {
    const { rerender } = render(<LoadingSkeleton viewMode="table" />);

    let grid = document.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
    );
    expect(grid).not.toBeInTheDocument();

    let tableHeader = document.querySelector('.bg-gray-50.border-b');
    expect(tableHeader).toBeInTheDocument();

    rerender(<LoadingSkeleton viewMode="cards" />);

    grid = document.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
    );
    expect(grid).toBeInTheDocument();

    tableHeader = document.querySelector('.bg-gray-50.border-b');
    expect(tableHeader).not.toBeInTheDocument();
  });
});
