/**
 * PendoBridge — Pendo SDK initialization and identity management.
 *
 * Initializes Pendo anonymously on mount (visitor.id = ''), then calls
 * pendo.identify() whenever the auth state changes to provide real
 * visitor + account metadata. On sign-out, re-initializes anonymously.
 *
 * Positioned in the provider stack below AuthProvider so it can subscribe
 * to auth state via useAuthStore.
 */

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../auth/authStore'
import type { Visitor, Workspace } from '../auth/types'

function identifyWithMetadata(visitor: Visitor, workspace: Workspace): void {
  pendo.identify({
    visitor: {
      id: visitor.id,
      email: visitor.email,
      full_name: `${visitor.firstName} ${visitor.lastName}`,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      username: visitor.username,
      jobTitle: visitor.jobTitle,
      role: visitor.role,
      yearsExperience: visitor.yearsExperience,
      location: visitor.location,
      primaryUseCase: visitor.primaryUseCase,
      teamSize: visitor.teamSize,
      topGoals: visitor.topGoals,
      createdAt: visitor.createdAt,
    },
    account: {
      id: workspace.id,
      name: workspace.companyName,
      companyName: workspace.companyName,
      companySize: workspace.companySize,
      industry: workspace.industry,
      planTier: workspace.planTier,
      createdAt: workspace.createdAt,
    },
  })
}

export function PendoBridge({ children }: { children: ReactNode }) {
  const initializedRef = useRef(false)
  const currentVisitor = useAuthStore((s) => s.currentVisitor)
  const currentWorkspace = useAuthStore((s) => s.currentWorkspace)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Initialize Pendo once (anonymous)
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    if (isAuthenticated && currentVisitor && currentWorkspace) {
      // Already signed in (e.g. session hydrated from localStorage)
      pendo.initialize({
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
    } else {
      pendo.initialize({ visitor: { id: '' } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Identify when auth state changes after initial mount
  const prevAuthRef = useRef(isAuthenticated)
  useEffect(() => {
    if (!initializedRef.current) return
    if (prevAuthRef.current === isAuthenticated) return
    prevAuthRef.current = isAuthenticated

    if (isAuthenticated && currentVisitor && currentWorkspace) {
      identifyWithMetadata(currentVisitor, currentWorkspace)
    } else {
      // Signed out — re-initialize anonymously
      pendo.initialize({ visitor: { id: '' } })
    }
  }, [isAuthenticated, currentVisitor, currentWorkspace])

  return <>{children}</>
}
