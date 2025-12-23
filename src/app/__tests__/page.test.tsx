import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Page from '../page';

// Mock the fetch API to avoid network calls in tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as unknown as typeof fetch;

describe('Page', () => {
  it('renders the claims dashboard', () => {
    render(<Page />);
    expect(
      screen.getByText('Loading claims...')
    ).toBeInTheDocument();
  });
});
