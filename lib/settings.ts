export type AppSettings = {
  darkMode: boolean
  notifDeadline: boolean
  notifDeposit: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  notifDeadline: true,
  notifDeposit: false,
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem('goalsaver_settings')
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}
