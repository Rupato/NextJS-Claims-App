import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ViewModeTabs } from '@/shared/ui/ViewModeTabs';

describe('ViewModeTabs', () => {
  const mockOnViewModeChange = vi.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  it('renders both tab buttons', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    expect(
      screen.getByRole('button', { name: /switch to table view/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /switch to card view/i })
    ).toBeInTheDocument();
  });

  it('has correct navigation role', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    const nav = screen.getByRole('navigation', {
      name: /view mode selection/i,
    });
    expect(nav).toBeInTheDocument();
  });

  it('applies active styles to table button when viewMode is table', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    const tableButton = screen.getByRole('button', {
      name: /switch to table view/i,
    });
    expect(tableButton).toHaveClass(
      'bg-blue-100',
      'text-blue-700',
      'border-blue-200'
    );
    expect(tableButton).toHaveAttribute('aria-pressed', 'true');

    const cardButton = screen.getByRole('button', {
      name: /switch to card view/i,
    });
    expect(cardButton).toHaveClass(
      'text-gray-500',
      'hover:text-gray-700',
      'hover:bg-gray-50'
    );
    expect(cardButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies active styles to card button when viewMode is cards', () => {
    render(
      <ViewModeTabs viewMode="cards" onViewModeChange={mockOnViewModeChange} />
    );

    const cardButton = screen.getByRole('button', {
      name: /switch to card view/i,
    });
    expect(cardButton).toHaveClass(
      'bg-blue-100',
      'text-blue-700',
      'border-blue-200'
    );
    expect(cardButton).toHaveAttribute('aria-pressed', 'true');

    const tableButton = screen.getByRole('button', {
      name: /switch to table view/i,
    });
    expect(tableButton).toHaveClass(
      'text-gray-500',
      'hover:text-gray-700',
      'hover:bg-gray-50'
    );
    expect(tableButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onViewModeChange with "table" when table button is clicked', () => {
    render(
      <ViewModeTabs viewMode="cards" onViewModeChange={mockOnViewModeChange} />
    );

    const tableButton = screen.getByRole('button', {
      name: /switch to table view/i,
    });
    fireEvent.click(tableButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('table');
    expect(mockOnViewModeChange).toHaveBeenCalledTimes(1);
  });

  it('calls onViewModeChange with "cards" when card button is clicked', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    const cardButton = screen.getByRole('button', {
      name: /switch to card view/i,
    });
    fireEvent.click(cardButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('cards');
    expect(mockOnViewModeChange).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS classes for all buttons', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass(
        'px-6',
        'md:px-8',
        'py-2',
        'text-sm',
        'font-medium',
        'rounded-md',
        'transition-colors',
        'whitespace-nowrap',
        'min-w-[100px]'
      );
    });
  });

  it('displays emojis in button text', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    expect(screen.getByText('Table View')).toBeInTheDocument();
    expect(screen.getByText('Card View')).toBeInTheDocument();
  });

  it('has flex layout container', () => {
    render(
      <ViewModeTabs viewMode="table" onViewModeChange={mockOnViewModeChange} />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex', 'space-x-1');
  });
});
