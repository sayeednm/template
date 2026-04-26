export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-4">
      <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse mb-6" />
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse mx-auto" />
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-10 bg-emerald-100 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}
