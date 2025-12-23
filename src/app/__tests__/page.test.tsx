import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Page', () => {
  it('renders the main heading', () => {
    render(<Page />);
    expect(
      screen.getByText('Testing CI pipeline failure - this will break Prettier formatting')
    ).toBeInTheDocument();
  });
});
