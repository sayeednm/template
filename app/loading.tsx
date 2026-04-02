export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
          💰
        </div>
        <span className="text-2xl font-bold text-slate-800">GoalSaver</span>
      </div>

      {/* Animated progress bar */}
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{
            animation: 'loading-bar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
