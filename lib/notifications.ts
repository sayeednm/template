export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') {
    await registerServiceWorker()
    return true
  }
  const permission = await Notification.requestPermission()
  if (permission === 'granted') await registerServiceWorker()
  return permission === 'granted'
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.register('/sw.js')
    return reg
  } catch {
    return null
  }
}

export async function sendNotification(title: string, body: string, icon = '/icon-192.png') {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  // Kirim lewat service worker kalau tersedia (works di PWA)
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      reg.active?.postMessage({ type: 'SHOW_NOTIFICATION', title, body, icon })
      return
    }
  }

  // Fallback ke Notification API biasa
  new Notification(title, { body, icon })
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}
