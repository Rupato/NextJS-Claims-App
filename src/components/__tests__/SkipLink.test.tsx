import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SkipLink from '../SkipLink';

describe('SkipLink', () => {
  it('renders the skip link with correct attributes', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveClass('sr-only');
  });

  it('has correct navigation role', () => {
    render(<SkipLink />);

    const nav = screen.getByRole('navigation', { name: /skip navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('shows link on focus', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveClass('sr-only');

    fireEvent.focus(link);
    // Note: The onFocus handler calls scrollIntoView, but doesn't change classes in this component
    // The focus classes are handled by Tailwind's focus: utilities
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('has correct styling classes', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveClass(
      'sr-only',
      'focus:not-sr-only',
      'focus:absolute',
      'focus:top-4',
      'focus:left-4',
      'bg-blue-600',
      'text-white',
      'px-4',
      'py-2',
      'rounded-md',
      'z-50',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2',
      'transition-all',
      'duration-200',
      'hover:bg-blue-700'
    );
  });

  it('calls scrollIntoView on focus', () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(<SkipLink />);

    const link = screen.getByRole('link', { name: /skip to main content/i });
    fireEvent.focus(link);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'nearest' });
  });
});
