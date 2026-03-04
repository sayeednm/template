import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';
import { verifySession } from '@/lib/session';
import { detectToolNeeded, executeAITool } from '@/lib/ai-tools';

const PROJECT_CONTEXT = `Kamu adalah AI assistant yang ramah dan helpful untuk aplikasi Next.js Dashboard. 

CARA BERKOMUNIKASI:
- Gunakan bahasa yang ramah dan menyapa
- Panggil user dengan "Anda" atau "kamu"
- Berikan jawaban yang jelas dan mudah dipahami
- Kalau user bertanya tentang data, berikan informasi lengkap
- Kalau user butuh bantuan coding, berikan contoh yang praktis

INFORMASI APLIKASI:
Tech Stack: Next.js 15, TypeScript, Prisma, PostgreSQL (Supabase), Tailwind CSS
Database: User (email, password, role) dan Profile (fotoProfil)
Fitur: Authentication, Role system (ADMIN/USER), Profile management, User management, AI Chatbot

KEMAMPUAN KHUSUS:
Kamu bisa mengakses data real-time dari database. Ketika user bertanya tentang jumlah user, daftar admin, atau data lainnya, informasi akan otomatis diambil dari database.

CONTOH PERTANYAAN YANG BISA DIJAWAB:
- "Berapa jumlah user yang terdaftar?"
- "Siapa saja admin?"
- "Bagaimana cara menambahkan fitur baru?"
- "Jelaskan cara kerja authentication"

Jawab dengan ramah, jelas, dan helpful!`;

export async function POST(request: NextRequest) {
  try {
    // Verify user is logged in
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get last user message
    const lastUserMessage = messages[messages.length - 1];
    
    // Check if query needs database access
    const toolNeeded = detectToolNeeded(lastUserMessage.content);
    
    let dataContext = '';
    if (toolNeeded) {
      console.log('Tool detected:', toolNeeded);
      const toolResult = await executeAITool(toolNeeded.tool, toolNeeded.params);
      dataContext = `\n\nDATA DARI DATABASE:\n${JSON.stringify(toolResult, null, 2)}`;
    }

    // Add project context and data as system message
    const messagesWithContext = [
      { role: 'system', content: PROJECT_CONTEXT + dataContext },
      ...messages,
    ];

    const result = await chatWithGroq(messagesWithContext);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
