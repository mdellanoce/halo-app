/// <reference types="vite/client" />

declare var pendo: any;

type PendoTrackEventName =
  | 'signin_completed'
  | 'signin_failed'
  | 'signup_step_completed'
  | 'signup_completed'
  | 'signout_completed'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_status_toggled'
  | 'task_filters_applied'
  | 'report_csv_exported'
  | 'report_filters_applied'
  | 'teammate_invited'
  | 'teammate_role_changed'
  | 'profile_saved'
  | 'workspace_saved'
  | 'plan_changed'
  | 'theme_changed'
  | 'demo_data_reset'
  | 'help_searched'

interface Window {
  pendo?: {
    track: (eventName: PendoTrackEventName, properties?: Record<string, unknown>) => void
    initialize: (options: Record<string, unknown>) => void
    identify: (options: Record<string, unknown>) => void
    updateOptions: (options: Record<string, unknown>) => void
    clearSession: () => void
    [key: string]: unknown
  }
}
