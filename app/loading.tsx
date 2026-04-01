export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo animasi */}
        <div className="relative mb-6 inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">💰</span>
          </div>
          {/* Ring spinner */}
          <div className="absolute -inset-1.5 border-4 border-emerald-200 border-t-emerald-500 rounded-3xl animate-spin" />
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-1">GoalSaver</h2>
        <p className="text-sm text-slate-500 mb-5">Memuat data tabunganmu...</p>

        {/* Progress bar animasi */}
        <div className="w-48 h-1.5 bg-emerald-100 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}
