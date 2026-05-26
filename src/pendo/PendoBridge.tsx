/**
 * PendoBridge — Pendo SDK lifecycle wiring.
 *
 * Calls `pendo.initialize` exactly once when the component mounts (app boot).
 * An empty visitor id lets the SDK resolve the previous visitor from
 * cookies/localStorage if available, otherwise it falls back to a new
 * anonymous visitor.
 *
 * `pendo.identify` (sign-in) and `pendo.clearSession` (sign-out) are wired
 * in `src/auth/authStore.ts` where visitor + workspace data is available.
 */

import { useEffect, type ReactNode } from 'react'

export function PendoBridge({ children }: { children: ReactNode }) {
  useEffect(() => {
    pendo.initialize({
      visitor: {
        id: '',
      },
    })
  }, [])

  return <>{children}</>
}
