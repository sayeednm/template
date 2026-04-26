export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-4">
      <div className="h-8 w-36 bg-slate-100 rounded-xl animate-pulse mb-6" />
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  )
}
