/**
 * Pendo Track Event helpers.
 *
 * `trackEvent` is a guarded wrapper around `pendo.track(...)`: it no-ops when
 * the Pendo agent is not on the page (snippet blocked, offline demo) and
 * swallows agent errors so analytics can never break an app flow.
 *
 * `trackEventAfterIdentify` covers events that happen in the same tick as a
 * sign-in (Account created, Signed in, Workspace seeded with demo data). Those
 * fire BEFORE PendoBridge's effect runs `pendo.identify(...)`, so a direct
 * `pendo.track` would be attributed to the anonymous visitor. Instead the
 * event is queued (module-level, survives route changes) and flushed by
 * `markPendoIdentified(accountId)` right after PendoBridge identifies that
 * account. If the account is already identified the event fires immediately.
 *
 * Visitor and account IDs are NOT passed as properties — the agent attaches
 * them automatically.
 */

export type TrackProperties = Record<string, string | number | boolean | string[] | null>

type PendingTrack = {
  accountId: string
  name: string
  properties: TrackProperties
}

let identifiedAccountId: string | null = null
const pendingTracks: PendingTrack[] = []

export function trackEvent(name: string, properties: TrackProperties = {}): void {
  try {
    if (typeof pendo === 'undefined' || typeof pendo.track !== 'function') return
    pendo.track(name, properties)
  } catch (err) {
    console.warn('[pendo] track failed:', name, err)
  }
}

export function trackEventAfterIdentify(
  accountId: string,
  name: string,
  properties: TrackProperties = {},
): void {
  if (identifiedAccountId === accountId) {
    trackEvent(name, properties)
    return
  }
  pendingTracks.push({ accountId, name, properties })
}

/**
 * Called by PendoBridge after `pendo.identify` (with the account id) and after
 * `pendo.clearSession` (with null). Flushes queued events for that account.
 */
export function markPendoIdentified(accountId: string | null): void {
  identifiedAccountId = accountId
  if (accountId === null) return
  for (let i = 0; i < pendingTracks.length; ) {
    const entry = pendingTracks[i]
    if (entry.accountId === accountId) {
      pendingTracks.splice(i, 1)
      trackEvent(entry.name, entry.properties)
    } else {
      i++
    }
  }
}
