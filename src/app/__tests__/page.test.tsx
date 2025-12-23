import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Page', () => {
  it('renders the main heading', () => {
    render(<Page />)
    expect(screen.getByText('To get started, edit the page.tsx file.')).toBeInTheDocument()
  })
})
