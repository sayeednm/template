import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';
import { verifySession } from '@/lib/session';
import { detectToolNeeded, executeAITool, createGoalForUser, getUserGoals } from '@/lib/ai-tools';

const SYSTEM_PROMPT = `Kamu adalah AI Assistant GoalSaver yang ramah, cerdas, dan sangat membantu.

TUGAS UTAMAMU:
1. Membantu user merencanakan tabungan dengan cara yang menyenangkan
2. Ketika user menyebut ingin membeli/menabung sesuatu, LANGSUNG bantu hitung dan buat rencana tabungan
3. Jawab pertanyaan tentang aplikasi GoalSaver

CARA MENDETEKSI INTENT TABUNGAN:
Jika user menyebut kata-kata seperti:
- "mau nabung", "ingin nabung", "pengen nabung"
- "mau beli", "ingin beli", "pengen beli"
- "nabung untuk", "saving for", "kumpulin uang"
- Menyebut nama produk (iPhone, laptop, PS5, dll)

CARA MERESPONS INTENT TABUNGAN:
1. Kenali barang yang ingin dibeli
2. Estimasi harga jika tidak disebutkan (gunakan harga pasar Indonesia terkini)
3. Tanya deadline jika belum disebutkan
4. Hitung tabungan per hari dan per bulan
5. Berikan respons dalam format JSON khusus (lihat di bawah)

FORMAT RESPONS GOAL (WAJIB digunakan saat user mau nabung):
Jika kamu mendeteksi intent tabungan DAN sudah punya cukup info (nama barang + estimasi harga + deadline),
tambahkan JSON berikut di AKHIR responmu (setelah teks biasa):

GOAL_SUGGESTION:{"title":"Nama Goal","targetAmount":15000000,"deadline":"2025-12-31","emoji":"📱","dailyAmount":41096,"monthlyAmount":1250000,"reasoning":"Penjelasan singkat"}

ATURAN PENTING:
- Harga dalam Rupiah (IDR), tanpa titik/koma
- Deadline format: YYYY-MM-DD
- Pilih emoji yang sesuai barang
- dailyAmount = targetAmount / jumlah hari
- monthlyAmount = dailyAmount * 30
- Jika user belum sebut deadline, TANYA dulu sebelum buat suggestion
- Jika user sudah sebut deadline, langsung buat suggestion

CONTOH PERCAKAPAN:
User: "saya mau nabung beli iPhone 17 Pro Max"
Kamu: "Wah pilihan yang keren! 📱 iPhone 17 Pro Max harganya sekitar Rp 22.000.000. 
Kapan kamu targetkan mau beli? Misalnya 6 bulan lagi, akhir tahun, dll?"

User: "6 bulan lagi"
Kamu: "Siap! Aku sudah hitung rencana tabunganmu 🎯
[teks penjelasan]
GOAL_SUGGESTION:{"title":"iPhone 17 Pro Max","targetAmount":22000000,"deadline":"2025-09-30","emoji":"📱","dailyAmount":120879,"monthlyAmount":3666667,"reasoning":"Harga estimasi iPhone 17 Pro Max di Indonesia"}

KEMAMPUAN LAIN:
- Bisa cek data user di database (jumlah user, statistik, dll)
- Bisa lihat goals tabungan user yang sedang login
- Bantu troubleshooting dan pertanyaan tentang aplikasi

Selalu gunakan bahasa Indonesia yang ramah dan semangat! 🚀`;

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, action, goalData } = await request.json();

    // Handle action: create goal langsung dari chat
    if (action === 'createGoal' && goalData) {
      const result = await createGoalForUser(
        session.userId,
        goalData.title,
        goalData.targetAmount,
        goalData.deadline,
        goalData.emoji
      );
      return NextResponse.json(result);
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1];

    // Cek apakah user minta lihat goals mereka
    let dataContext = '';
    const lowerMsg = lastUserMessage.content.toLowerCase();

    if (lowerMsg.includes('goal') && (lowerMsg.includes('saya') || lowerMsg.includes('ku') || lowerMsg.includes('lihat'))) {
      const goalsData = await getUserGoals(session.userId);
      dataContext = `\n\nGOALS USER SAAT INI:\n${JSON.stringify(goalsData, null, 2)}`;
    }

    // Cek tool database lainnya
    const toolNeeded = detectToolNeeded(lastUserMessage.content);
    if (toolNeeded) {
      const toolResult = await executeAITool(toolNeeded.tool, toolNeeded.params);
      dataContext += `\n\nDATA DARI DATABASE:\n${JSON.stringify(toolResult, null, 2)}`;
    }

    const messagesWithContext = [
      { role: 'system', content: SYSTEM_PROMPT + dataContext },
      ...messages,
    ];

    const result = await chatWithGroq(messagesWithContext);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Parse goal suggestion dari respons AI
    const rawMessage = result.message || '';
    const goalMatch = rawMessage.match(/GOAL_SUGGESTION:(\{[^}]+\})/);

    let goalSuggestion = null;
    let cleanMessage = rawMessage;

    if (goalMatch) {
      try {
        goalSuggestion = JSON.parse(goalMatch[1]);
        cleanMessage = rawMessage.replace(/GOAL_SUGGESTION:\{[^}]+\}/, '').trim();
      } catch {
        // JSON parse gagal, abaikan
      }
    }

    return NextResponse.json({
      message: cleanMessage,
      goalSuggestion,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
