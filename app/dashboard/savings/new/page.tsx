import NewGoalForm from './NewGoalForm'

export default function NewGoalPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tambah Target Baru</h1>
        <p className="text-slate-500 mt-1">Tentukan tujuan dan mulai menabung!</p>
      </div>
      <NewGoalForm />
    </div>
  )
}
