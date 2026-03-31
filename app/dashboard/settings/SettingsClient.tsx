'use client'

import { useEffect, useState } from 'react'
import { requestNotificationPermission, getNotificationPermission, sendNotification } from '@/lib/notifications'

type Settings = {
  darkMode: boolean
  notifDeadline: boolean
  notifDeposit: boolean
}

const DEFAULT: Settings = { darkMode: false, notifDeadline: true, notifDeposit: false }

export default function SettingsClient() {
  const [settings, setSettings] = useState<Settings>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const [notifPermission, setNotifPermission] = useState<string>('default')
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('goalsaver_settings')
    if (stored) setSettings(JSON.parse(stored))
    setNotifPermission(getNotificationPermission())
  }, [])

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Dispatch event agar DarkModeProvider di layout tahu
    window.dispatchEvent(new Event('darkModeChange'))
  }, [settings.darkMode])

  const update = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    // Simpan langsung ke localStorage saat toggle berubah
    localStorage.setItem('goalsaver_settings', JSON.stringify(newSettings))
  }

  const handleSave = () => {
    localStorage.setItem('goalsaver_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRequestPermission = async () => {
    setRequesting(true)
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
    if (granted) {
      // Kirim notifikasi test
      sendNotification('GoalSaver 🎯', 'Notifikasi berhasil diaktifkan! Kamu akan mendapat pengingat deadline.')
    }
    setRequesting(false)
  }

  const permissionLabel = {
    granted: { text: 'Diizinkan ✓', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', textMain: 'text-emerald-800' },
    denied: { text: 'Diblokir', color: 'text-red-600', bg: 'bg-red-50 border-red-200', textMain: 'text-red-800' },
    default: { text: 'Belum diizinkan', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', textMain: 'text-yellow-800' },
    unsupported: { text: 'Tidak didukung', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', textMain: 'text-slate-600' },
  }[notifPermission] ?? { text: 'Unknown', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', textMain: 'text-slate-600' }

  return (
    <div className="space-y-4">
      {/* Tampilan */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Tampilan</h2>
        <p className="text-xs text-slate-400 mb-5">Sesuaikan tampilan aplikasi</p>
        <ToggleRow
          icon="🌙"
          label="Mode Gelap"
          desc="Aktifkan tema gelap untuk kenyamanan mata"
          checked={settings.darkMode}
          onChange={(v) => update('darkMode', v)}
        />
      </div>

      {/* Notifikasi */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Notifikasi</h2>
        <p className="text-xs text-slate-400 mb-4">Notifikasi akan muncul di layar HP/laptop kamu</p>

        {/* Status izin */}
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-5 ${permissionLabel.bg}`}>
          <div>
            <p className={`text-sm font-medium ${permissionLabel.textMain}`}>Status Notifikasi</p>
            <p className={`text-xs font-semibold ${permissionLabel.color}`}>{permissionLabel.text}</p>
          </div>
          {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
            <button
              onClick={handleRequestPermission}
              disabled={requesting || notifPermission === 'denied'}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50"
            >
              {requesting ? 'Meminta...' : notifPermission === 'denied' ? 'Diblokir' : 'Izinkan'}
            </button>
          )}
        </div>

        {notifPermission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-600">
            Notifikasi diblokir oleh browser. Buka pengaturan browser → izinkan notifikasi untuk situs ini.
          </div>
        )}

        <div className="space-y-4">
          <ToggleRow
            icon="⏰"
            label="Pengingat Deadline"
            desc="Notifikasi OS saat deadline goal sudah dekat"
            checked={settings.notifDeadline}
            onChange={(v) => update('notifDeadline', v)}
            disabled={notifPermission !== 'granted'}
          />
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            <ToggleRow
              icon="💸"
              label="Konfirmasi Deposit"
              desc="Notifikasi OS setiap kali berhasil deposit"
              checked={settings.notifDeposit}
              onChange={(v) => update('notifDeposit', v)}
              disabled={notifPermission !== 'granted'}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
      </button>
    </div>
  )
}

function ToggleRow({
  icon, label, desc, checked, onChange, disabled = false,
}: {
  icon: string; label: string; desc: string
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked && !disabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
