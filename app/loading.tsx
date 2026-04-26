export default function Loading() {
  return (
    <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center gap-6">
      {/* Icon */}
      <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center shadow-lg">
        <span className="text-5xl">💰</span>
      </div>

      {/* App name */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">GoalSaver</h1>
        <p className="text-emerald-100 text-sm mt-1">Tabungan berbasis goal</p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-white rounded-full opacity-80"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
