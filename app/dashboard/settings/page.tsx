import SettingsClient from './SettingsClient'

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Pengaturan</h1>
      <SettingsClient />
    </div>
  )
}
