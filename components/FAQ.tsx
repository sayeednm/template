'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Bagaimana cara membuat goal tabungan?',
    a: 'Klik menu "➕ Tambah Target" di sidebar, lalu isi nama goal, target jumlah, deadline (opsional), dan foto barang incaran. Kamu juga bisa minta AI untuk membuatkan goal otomatis lewat chatbot.',
  },
  {
    q: 'Bagaimana cara deposit/menabung?',
    a: 'Di dashboard, setiap goal punya tombol cepat (+10rb, +50rb, +100rb) atau input "Lainnya" untuk nominal bebas. Kamu juga bisa tambah catatan di setiap deposit.',
  },
  {
    q: 'Apa itu fitur Jeda Goal?',
    a: 'Fitur Jeda Goal memungkinkan kamu menghentikan sementara aktivitas menabung tanpa menghapus goal. Saat dijeda, deadline otomatis mundur sesuai lama jeda. Buka halaman Detail goal untuk mengaktifkannya.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Ya! Semua data tersimpan di server cloud yang aman dan terenkripsi. Password kamu di-hash sehingga tidak bisa dibaca siapapun, termasuk admin.',
  },
  {
    q: 'Bagaimana cara menggunakan AI Goal Creator?',
    a: 'Klik ikon chat di pojok kanan bawah, lalu ceritakan apa yang ingin kamu beli. Contoh: "saya mau nabung beli iPhone 17". AI akan menghitung target dan membuatkan goal otomatis untukmu!',
  },
  {
    q: 'Bisakah aplikasi ini diinstall di HP?',
    a: 'Bisa! GoalSaver adalah PWA (Progressive Web App). Di browser HP, klik menu browser → "Tambahkan ke layar utama" atau "Install App". Aplikasi akan muncul seperti app biasa di HP kamu.',
  },
  {
    q: 'Bagaimana cara menghapus riwayat transaksi?',
    a: 'Buka halaman "Riwayat Menabung", hover ke transaksi yang ingin dihapus, lalu klik ikon tempat sampah yang muncul. Saldo goal akan otomatis berkurang.',
  },
  {
    q: 'Apakah GoalSaver gratis?',
    a: 'Ya, GoalSaver gratis selamanya untuk fitur dasar. Daftar sekarang dan mulai wujudkan impianmu!',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-semibold text-slate-800">❓ Pertanyaan Umum (FAQ)</h2>
        <p className="text-xs text-slate-400 mt-0.5">Cari jawaban sebelum mengirim pesan</p>
      </div>
      <div className="divide-y divide-slate-100">
        {FAQS.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700 pr-4">{faq.q}</span>
              <span className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {open === i && (
              <div className="px-6 pb-4">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
