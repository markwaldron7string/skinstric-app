import { render, screen } from '@testing-library/react'
import FormPage from './page'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}))

describe('FormPage', () => {
  it('renders the first step', () => {
    render(<FormPage />)
    expect(screen.getByText('TO START ANALYSIS')).toBeInTheDocument()
  })
  it('advances from the name step to the city step', async () => {
    const user = userEvent.setup()
    render(<FormPage />)

    const input = screen.getByPlaceholderText('Introduce Yourself')
    await user.type(input, 'Mark')

    await user.keyboard('{Enter}')

    expect(screen.getByPlaceholderText('your city name')).toBeInTheDocument()
  })
  it('shows an error and stays on the name step for invalid input', async () => {
    const user = userEvent.setup()
    render(<FormPage />)

    const input = screen.getByPlaceholderText('Introduce Yourself')
    await user.type(input, 'Mark123')
    await user.keyboard('{Enter}')

    // The error message should appear...
    expect(screen.getByText('Only letters allowed')).toBeInTheDocument()
    // ...and we should NOT have advanced — the city input must be absent.
    expect(screen.queryByPlaceholderText('your city name')).not.toBeInTheDocument()
  })
})