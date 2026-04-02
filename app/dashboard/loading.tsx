export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-5">
        <div className="h-8 w-52 bg-slate-100 rounded-xl mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        <div className="h-20 bg-emerald-100 rounded-2xl animate-pulse" />
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Goal cards skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-36 bg-slate-100 rounded-lg animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full animate-pulse mb-3" />
            <div className="flex gap-2">
              <div className="h-7 w-14 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-7 w-14 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-7 w-14 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
