export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-3">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse mb-6" />
      {[1,2,3,4,5].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
