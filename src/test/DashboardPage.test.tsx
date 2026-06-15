import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { DashboardPage } from '../pages/DashboardPage'
import { BrowserRouter } from 'react-router-dom'
import * as useAuthHook from '../hooks/useAuth'
import * as useApplicationsHook from '../hooks/useApplications'
import { Application } from '../types'
import type { User } from '@supabase/supabase-js'

// Mock dependencies
vi.mock('../hooks/useAuth')
vi.mock('../hooks/useApplications')
vi.mock('../lib/supabase')

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </BrowserRouter>
    )
  })
}

describe('DashboardPage', () => {
  it('renders "No applications yet" message when array is empty', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' } as unknown as User,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    vi.mocked(useApplicationsHook.useApplications).mockReturnValue({
      applications: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
      createApplication: vi.fn(),
      updateApplication: vi.fn(),
      deleteApplication: vi.fn(),
      addTimelineEvent: vi.fn(),
      deleteTimelineEvent: vi.fn(),
    })

    renderWithRouter(<DashboardPage />)
    expect(screen.getByText(/ui.noApplications/i)).toBeInTheDocument()
  })

  it('renders the company name in the table and correct stats when applications exist', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' } as unknown as User,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    vi.mocked(useApplicationsHook.useApplications).mockReturnValue({
      applications: [{
        id: '1',
        company: 'Stark Industries',
        role_title: 'Engineer',
        status: 'active',
        applied_at: '2024-01-01',
      } as Application],
      loading: false,
      error: null,
      refetch: vi.fn(),
      createApplication: vi.fn(),
      updateApplication: vi.fn(),
      deleteApplication: vi.fn(),
      addTimelineEvent: vi.fn(),
      deleteTimelineEvent: vi.fn(),
    })

    renderWithRouter(<DashboardPage />)

    // Check company name in table
    expect(screen.getByText('Stark Industries')).toBeInTheDocument()

    // Check stats (Total card)
    const statsBar = screen.getByText('dashboard.total').closest('div')
    if (statsBar) {
      expect(within(statsBar).getByText('1')).toBeInTheDocument()
    }
  })
})
