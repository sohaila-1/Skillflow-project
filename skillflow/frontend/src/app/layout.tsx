import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { KeycloakProvider } from '../providers/keycloak-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SkillFlow — Master Skills That Matter',
    template: '%s | SkillFlow',
  },
  description:
    'Learn from industry experts with hands-on projects, interactive quizzes, and personalized feedback that accelerates your growth.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KeycloakProvider>{children}</KeycloakProvider>
      </body>
    </html>
  )
}
