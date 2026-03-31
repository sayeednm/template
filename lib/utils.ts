import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export function daysLeft(deadline: Date): number {
  const now = new Date()
  const diff = new Date(deadline).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function calcDailyTarget(remaining: number, deadline: Date): number {
  const days = daysLeft(deadline)
  if (days <= 0) return remaining
  return Math.ceil(remaining / days)
}

export function getMotivation(progress: number): { emoji: string; message: string; color: string } {
  if (progress === 0) return { emoji: '🚀', message: 'Ayo mulai nabung! Perjalanan seribu mil dimulai dari satu langkah.', color: 'text-slate-500' }
  if (progress < 10) return { emoji: '🌱', message: 'Bagus! Kamu sudah mulai. Terus semangat ya!', color: 'text-emerald-500' }
  if (progress < 25) return { emoji: '💪', message: 'Keren! Kamu sudah di jalur yang benar. Jangan berhenti!', color: 'text-emerald-600' }
  if (progress < 50) return { emoji: '🔥', message: 'Mantap! Sudah seperempat jalan. Kamu bisa!', color: 'text-orange-500' }
  if (progress < 75) return { emoji: '⭐', message: 'Luar biasa! Lebih dari setengah jalan. Terus nabung!', color: 'text-yellow-500' }
  if (progress < 90) return { emoji: '🏆', message: 'Hampir sampai! Sedikit lagi impianmu terwujud!', color: 'text-violet-500' }
  if (progress < 100) return { emoji: '🎯', message: 'Tinggal sedikit lagi! Jangan menyerah sekarang!', color: 'text-blue-500' }
  return { emoji: '🎉', message: 'SELAMAT! Kamu berhasil mencapai targetmu!', color: 'text-emerald-600' }
}
