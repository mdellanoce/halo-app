/**
 * Pendo Track Event helpers.
 *
 * Thin wrappers around `pendo.track(...)` so call sites stay one line and a
 * missing or failing Pendo agent can never break the app flow. The Pendo
 * agent attaches the current visitor + account automatically — never pass
 * visitor or account IDs as properties.
 *
 * Event names are registered in Pendo verbatim — do not re-case or reword
 * them at the call sites.
 */

export type TrackProperties = Record<string, string | number | boolean | null>

/** Send a Pendo Track Event. No-ops if the agent is not on the page. */
export function trackEvent(event: string, properties: TrackProperties = {}): void {
  try {
    if (typeof pendo === 'undefined' || typeof pendo.track !== 'function') return
    pendo.track(event, properties)
  } catch (err) {
    console.warn(`[pendo] track failed for "${event}":`, err)
  }
}

/**
 * Send a Track Event for an action that also signs the visitor in.
 *
 * `PendoBridge` calls `pendo.identify(...)` from a React effect that runs
 * after the auth store update re-renders the tree. Deferring to the next
 * macrotask lets that identify run first, so the event is attributed to the
 * signed-in visitor + workspace instead of the anonymous visitor.
 */
export function trackAfterIdentify(event: string, properties: TrackProperties = {}): void {
  setTimeout(() => trackEvent(event, properties), 0)
}
