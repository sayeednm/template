export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-slate-200 rounded-xl mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="h-7 w-10 bg-slate-200 rounded-lg mx-auto mb-2" />
            <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Goal cards skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-36 bg-slate-200 rounded-lg" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
            <div className="h-3 bg-slate-100 rounded-full mb-3" />
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-slate-100 rounded-lg" />
              <div className="h-7 w-16 bg-slate-100 rounded-lg" />
              <div className="h-7 w-16 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
