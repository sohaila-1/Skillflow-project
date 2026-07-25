import React from 'react'
import { render, screen } from '@testing-library/react'
import CTAButtons from './CTAButtons'

jest.mock('../providers/keycloak-provider', () => ({
  useKeycloak: jest.fn(),
}))

jest.mock('next/link', () =>
  function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
)

import { useKeycloak } from '../providers/keycloak-provider'
const mockUseKeycloak = useKeycloak as jest.Mock

describe('CTAButtons', () => {
  it('shows Dashboard and Browse Courses links when authenticated', () => {
    mockUseKeycloak.mockReturnValue({ isAuthenticated: true })
    render(<CTAButtons />)

    expect(screen.getByRole('link', { name: /go to dashboard/i })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: /browse courses/i })).toHaveAttribute('href', '/courses')
    expect(screen.queryByRole('link', { name: /join for free/i })).toBeNull()
  })

  it('shows Join for Free and Browse Courses links when not authenticated', () => {
    mockUseKeycloak.mockReturnValue({ isAuthenticated: false })
    render(<CTAButtons />)

    expect(screen.getByRole('link', { name: /join for free/i })).toHaveAttribute('href', '/auth/register')
    expect(screen.getByRole('link', { name: /browse courses/i })).toHaveAttribute('href', '/courses')
    expect(screen.queryByRole('link', { name: /go to dashboard/i })).toBeNull()
  })
})
