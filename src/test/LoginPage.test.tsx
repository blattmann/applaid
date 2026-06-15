import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginPage } from '../pages/LoginPage'
import { BrowserRouter } from 'react-router-dom'

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
  }),
}))

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </BrowserRouter>
    )
  })
}

describe('LoginPage', () => {
  it('renders email and password inputs', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByLabelText(/fields.email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/fields.password/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    renderWithRouter(<LoginPage />)
    // Use type="submit" to distinguish from the toggle button
    const submitBtn = screen.getByRole('button', { name: /login.signIn/i })
    expect(submitBtn).toHaveAttribute('type', 'submit')
  })

  it('toggles between sign in and sign up mode when the toggle link is clicked', () => {
    renderWithRouter(<LoginPage />)

    // Initially Sign in text on submit button
    expect(screen.getByRole('button', { name: /login.signIn/i, queryFallbacks: true })).toHaveAttribute('type', 'submit')

    // Look for toggle button (not the submit one)
    const toggleBtn = screen.getByText(/login.signUp/i)
    fireEvent.click(toggleBtn)

    // Now Sign up / Create account text on submit button
    const submitBtn = screen.getByRole('button', { name: /login.signUp/i, queryFallbacks: true })
    expect(submitBtn).toHaveAttribute('type', 'submit')
  })
})
