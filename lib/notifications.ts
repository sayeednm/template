export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false

  if (Notification.permission === 'granted') return true

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function sendNotification(title: string, body: string, icon = '/icon-192.png') {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  new Notification(title, { body, icon })
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}
