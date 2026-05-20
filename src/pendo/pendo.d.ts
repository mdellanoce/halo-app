/**
 * Global type declaration for the Pendo agent.
 *
 * The Pendo snippet loads asynchronously via PendoBridge (Phase 6), so
 * `pendo` may be undefined before initialization completes. All call-sites
 * guard with `typeof pendo !== 'undefined'` before invoking.
 */

interface PendoAgent {
  initialize(options: Record<string, unknown>): void
  identify(options: Record<string, unknown>): void
  track(eventName: string, properties?: Record<string, unknown>): void
  clearSession(): void
  updateOptions(options: Record<string, unknown>): void
  location: {
    setUrl(url: string): void
  }
}

declare const pendo: PendoAgent | undefined
