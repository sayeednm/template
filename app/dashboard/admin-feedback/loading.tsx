export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse mb-6" />
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
