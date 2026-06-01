/**
 * PendoBridge — Phase 6: Pendo Install & Wiring.
 *
 * This component subscribes to the Zustand auth store and keeps
 * Pendo in sync with the user's authentication state:
 *
 *   - When the user signs in (`isAuthenticated` becomes true):
 *     calls `pendo.identify(...)` with the full visitor + account metadata.
 *   - When the user signs out (`isAuthenticated` becomes false after being true):
 *     calls `pendo.clearSession()` to reset to an anonymous visitor.
 *
 * `pendo.initialize(...)` is called ONCE in `src/main.tsx` at app boot —
 * this component never calls initialize.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { useAuthStore } from '../auth/authStore'

export function PendoBridge({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const currentVisitor = useAuthStore((s) => s.currentVisitor)
  const currentWorkspace = useAuthStore((s) => s.currentWorkspace)
  const wasAuthenticated = useRef(false)

  useEffect(() => {
    if (isAuthenticated && currentVisitor && currentWorkspace) {
      pendo.identify({
        visitor: {
          id: currentVisitor.id,
          email: currentVisitor.email,
          full_name: `${currentVisitor.firstName} ${currentVisitor.lastName}`,
          firstName: currentVisitor.firstName,
          lastName: currentVisitor.lastName,
          username: currentVisitor.username,
          jobTitle: currentVisitor.jobTitle,
          role: currentVisitor.role,
          yearsExperience: currentVisitor.yearsExperience,
          location: currentVisitor.location,
          primaryUseCase: currentVisitor.primaryUseCase,
          teamSize: currentVisitor.teamSize,
          topGoals: currentVisitor.topGoals,
          createdAt: currentVisitor.createdAt,
        },
        account: {
          id: currentWorkspace.id,
          name: currentWorkspace.companyName,
          companyName: currentWorkspace.companyName,
          companySize: currentWorkspace.companySize,
          industry: currentWorkspace.industry,
          planTier: currentWorkspace.planTier,
          createdAt: currentWorkspace.createdAt,
        },
      })
      wasAuthenticated.current = true
    } else if (!isAuthenticated && wasAuthenticated.current) {
      pendo.clearSession()
      wasAuthenticated.current = false
    }
  }, [isAuthenticated, currentVisitor, currentWorkspace])

  return <>{children}</>
}
