'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  goalSuggestion?: GoalSuggestion | null;
  goalCreated?: boolean;
};

type GoalSuggestion = {
  title: string;
  targetAmount: number;
  deadline: string | null;
  emoji: string;
  dailyAmount: number;
  monthlyAmount: number;
  reasoning: string;
};

function formatRp(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) { try { setMessages(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('chatHistory', JSON.stringify(messages));
    else localStorage.removeItem('chatHistory');
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.message,
        goalSuggestion: data.goalSuggestion ?? null,
      }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi ya!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (suggestion: GoalSuggestion, msgIndex: number) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createGoal', goalData: suggestion }),
    });
    const data = await res.json();

    if (data.success) {
      setMessages((prev) => prev.map((m, i) =>
        i === msgIndex ? { ...m, goalCreated: true, goalSuggestion: null } : m
      ));
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: `✅ Goal "${suggestion.emoji} ${suggestion.title}" berhasil dibuat! Yuk mulai nabung sekarang 💪`,
      }]);
      router.refresh();
    }
  };

  const quickPrompts = [
    '💻 Nabung beli laptop',
    '📱 Nabung beli iPhone',
    '✈️ Nabung liburan',
    '🎮 Nabung beli PS5',
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] shadow-xl flex flex-col z-50 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <h3 className="font-semibold text-sm">GoalSaver AI</h3>
                <p className="text-xs text-emerald-100">Bantu rencanakan tabunganmu</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button onClick={() => { if (confirm('Hapus percakapan?')) setMessages([]) }} className="hover:bg-white/20 rounded-lg p-1.5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1.5 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-5xl mb-3">🤖</div>
                <h3 className="font-semibold text-slate-700 mb-1">Halo! Aku GoalSaver AI</h3>
                <p className="text-sm text-slate-500 mb-5">Ceritakan apa yang ingin kamu tabung, aku bantu hitung dan buatkan goalnya!</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {quickPrompts.map((p) => (
                    <button key={p} onClick={() => setInput(p.split(' ').slice(1).join(' '))}
                      className="text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors text-left">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs">🤖</div>
                  )}
                  <div className="max-w-[80%] space-y-2">
                    {msg.content && (
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    )}

                    {/* Goal Suggestion Card */}
                    {msg.goalSuggestion && !msg.goalCreated && (
                      <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{msg.goalSuggestion.emoji}</span>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{msg.goalSuggestion.title}</p>
                            <p className="text-xs text-slate-400">{msg.goalSuggestion.reasoning}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-emerald-50 rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-500">Target</p>
                            <p className="text-sm font-bold text-emerald-600">{formatRp(msg.goalSuggestion.targetAmount)}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-500">Per bulan</p>
                            <p className="text-sm font-bold text-slate-700">{formatRp(msg.goalSuggestion.monthlyAmount)}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-500">Per hari</p>
                            <p className="text-sm font-bold text-slate-700">{formatRp(msg.goalSuggestion.dailyAmount)}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-500">Deadline</p>
                            <p className="text-sm font-bold text-slate-700">
                              {msg.goalSuggestion.deadline
                                ? new Date(msg.goalSuggestion.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                : 'Tanpa batas'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreateGoal(msg.goalSuggestion!, idx)}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                        >
                          ✨ Buat Goal Ini Sekarang!
                        </button>
                      </div>
                    )}

                    {msg.goalCreated && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-700 font-medium">
                        ✅ Goal berhasil dibuat!
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-xs">🤖</div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ceritakan apa yang mau kamu tabung..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
