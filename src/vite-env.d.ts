/// <reference types="vite/client" />

declare var pendo: any;

interface Window {
  pendo?: {
    track: (eventName: string, properties?: Record<string, unknown>) => void
    initialize: (options: Record<string, unknown>) => void
    identify: (options: Record<string, unknown>) => void
    updateOptions: (options: Record<string, unknown>) => void
    [key: string]: unknown
  }
}
