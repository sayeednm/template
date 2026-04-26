export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse mb-6" />
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="h-9 w-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-10 bg-blue-100 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}
