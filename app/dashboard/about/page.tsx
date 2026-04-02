import Link from 'next/link'

const VERSION = '1.0.0'
const FEATURES = [
  { icon: '🤖', title: 'AI Goal Creator', desc: 'Ceritakan impianmu, AI langsung buatkan rencana tabungan otomatis.' },
  { icon: '📊', title: 'Grafik Progress', desc: 'Pantau perkembangan tabungan dengan grafik real-time yang interaktif.' },
  { icon: '🔔', title: 'Notifikasi Deadline', desc: 'Pengingat otomatis saat deadline goal sudah dekat.' },
  { icon: '📱', title: 'Bisa Diinstall', desc: 'Install sebagai app di HP atau laptop tanpa App Store.' },
  { icon: '⏸', title: 'Jeda Goal', desc: 'Jeda menabung sementara, deadline otomatis menyesuaikan.' },
  { icon: '🏆', title: 'Halaman Capaian', desc: 'Lihat semua goal yang sudah berhasil kamu wujudkan.' },
  { icon: '💬', title: 'Hubungi Admin', desc: 'Kirim pertanyaan, laporan bug, atau saran fitur langsung ke admin.' },
  { icon: '🌙', title: 'Mode Gelap', desc: 'Tampilan gelap yang nyaman untuk mata di malam hari.' },
]

export default function AboutPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
          💰
        </div>
        <h1 className="text-2xl font-bold text-slate-800">GoalSaver</h1>
        <p className="text-slate-500 text-sm mt-1">Wujudkan impianmu satu tabungan dalam satu waktu</p>
        <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
          Versi {VERSION}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-2">Tentang GoalSaver</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          GoalSaver adalah aplikasi tabungan berbasis goal yang membantu kamu merencanakan dan mewujudkan impian secara terstruktur.
          Didukung teknologi AI, GoalSaver bisa membuatkan rencana tabungan otomatis hanya dari percakapan biasa.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          Cocok untuk semua usia — dari anak-anak yang baru belajar menabung hingga orang dewasa yang ingin mencapai tujuan finansial.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Fitur Unggulan</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 px-5 py-3.5">
              <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-slate-700">{f.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-3">Informasi Teknis</h2>
        <div className="space-y-2 text-sm">
          {[
            ['Versi', VERSION],
            ['Platform', 'Web App (PWA)'],
            ['AI Engine', 'Groq AI — Llama 3.3 70B'],
            ['Database', 'PostgreSQL (Supabase)'],
            ['Framework', 'Next.js 15'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-sm text-emerald-700 mb-3">Ada saran atau masalah? Kami senang mendengarnya!</p>
        <Link href="/dashboard/feedback"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          Hubungi Admin
        </Link>
      </div>
    </div>
  )
}
