export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-3">
      <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse mb-6" />
      {[1,2,3,4,5].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-20 bg-emerald-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}
