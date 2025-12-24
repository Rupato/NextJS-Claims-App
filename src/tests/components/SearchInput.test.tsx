import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '@/shared/ui/SearchInput';

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    isSearching: false,
  };

  it('renders with default placeholder', () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search claims...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput {...defaultProps} placeholder="Custom search..." />);
    const input = screen.getByPlaceholderText('Custom search...');
    expect(input).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    render(<SearchInput {...defaultProps} value="test search" />);
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<SearchInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(onChange).toHaveBeenCalledWith('new search');
  });

  it('shows search icon when not searching', () => {
    render(<SearchInput {...defaultProps} />);
    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('shows loading spinner when searching', () => {
    render(<SearchInput {...defaultProps} isSearching={true} />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput {...defaultProps} value="" />);
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('shows clear button when value is not empty', () => {
    render(<SearchInput {...defaultProps} value="search text" />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    const onChange = vi.fn();
    render(
      <SearchInput {...defaultProps} value="search text" onChange={onChange} />
    );

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search claims');
  });

  it('applies correct CSS classes', () => {
    render(<SearchInput {...defaultProps} />);
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('relative', 'w-full', 'max-w-md');

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'block',
      'w-full',
      'pl-10',
      'pr-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'leading-5',
      'bg-white',
      'placeholder-gray-500',
      'focus:outline-none',
      'focus:placeholder-gray-400',
      'focus:ring-1',
      'focus:ring-blue-500',
      'focus:border-blue-500'
    );
  });

  it('has proper input attributes', () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('aria-label', 'Search claims');
    expect(input).toHaveAttribute('placeholder', 'Search claims...');
  });
});
