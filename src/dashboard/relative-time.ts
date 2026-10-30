/**
 * Halo relative-time formatting (Phase 3 dashboard activity feed).
 * Produces strings like '2h ago', 'Yesterday', '3d ago' from an ISO-8601
 * input relative to a `nowRef` ISO-8601 input. Pure function, no dayjs
 * dependency — dayjs is in the recommended stack but not yet installed
 * (CLAUDE.md Recommended Stack section), and the activity feed only needs
 * 4 buckets.
 *
 * Strings resolve through the shared i18n instance (`dashboard.relativeTime.*`)
 * at call time, so callers rendering under `useTranslation()` re-render with
 * the active locale without passing `t` in.
 */
import i18n from '../i18n'

/**
 * Formats an ISO-8601 timestamp as a human-readable relative string.
 *
 * Buckets:
 *   < 1 minute  → 'Just now'
 *   < 1 hour    → '{N}m ago'
 *   < 1 day     → '{N}h ago'
 *   < 2 days    → 'Yesterday'
 *   ≥ 2 days    → '{N}d ago'
 *
 * Returns '—' (em-dash) if either input is not a valid date string (NaN).
 * Never throws. Future timestamps (deltaMs < 0) clamp to 'Just now'.
 *
 * @param isoTimestamp - ISO-8601 timestamp string to format
 * @param nowRefIso    - ISO-8601 reference "now" string
 */
export function formatRelative(isoTimestamp: string, nowRefIso: string): string {
  const tsMs = new Date(isoTimestamp).getTime()
  const nowMs = new Date(nowRefIso).getTime()

  if (isNaN(tsMs) || isNaN(nowMs)) {
    return '—'
  }

  const deltaMs = Math.max(0, nowMs - tsMs)

  if (deltaMs < 60_000) {
    return i18n.t('dashboard.relativeTime.justNow')
  }

  if (deltaMs < 3_600_000) {
    return i18n.t('dashboard.relativeTime.minutesAgo', { n: Math.floor(deltaMs / 60_000) })
  }

  if (deltaMs < 86_400_000) {
    return i18n.t('dashboard.relativeTime.hoursAgo', { n: Math.floor(deltaMs / 3_600_000) })
  }

  if (deltaMs < 172_800_000) {
    return i18n.t('dashboard.relativeTime.yesterday')
  }

  return i18n.t('dashboard.relativeTime.daysAgo', { n: Math.floor(deltaMs / 86_400_000) })
}
