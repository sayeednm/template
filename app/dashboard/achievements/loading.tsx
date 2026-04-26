export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse mx-auto" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse mx-auto" />
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
