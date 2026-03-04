import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';
import { verifySession } from '@/lib/session';
import { detectToolNeeded, executeAITool } from '@/lib/ai-tools';

const PROJECT_CONTEXT = `Kamu adalah AI assistant untuk project Next.js Dashboard Template. Berikut informasi tentang project ini:

TECH STACK:
- Next.js 15 dengan App Router
- TypeScript
- Prisma ORM dengan PostgreSQL (Supabase)
- Tailwind CSS + shadcn/ui
- Authentication dengan JWT (jose)
- Supabase Storage untuk upload foto

STRUKTUR PROJECT:
- app/(auth)/ - Halaman login dan register
- app/dashboard/ - Dashboard dengan layout dan navbar
- app/api/ - API routes (auth, profile, users, chat)
- components/ui/ - UI components dari shadcn
- lib/ - Utilities (prisma, session, supabase, groq)
- prisma/schema.prisma - Database schema

DATABASE SCHEMA:
- User: id, email, password, role (ADMIN/USER), createdAt, updatedAt
- Profile: id, userId, fotoProfil, createdAt, updatedAt

FITUR UTAMA:
1. Authentication (login/register dengan token)
2. Role-based access (ADMIN & USER)
3. Profile management dengan upload foto
4. User management (khusus ADMIN)
5. AI Chatbot dengan Groq (Llama 3.3 70B)

KEMAMPUAN KHUSUS:
Kamu bisa mengakses data real-time dari database. Ketika user bertanya tentang data (seperti "berapa jumlah user?", "siapa saja admin?"), data akan otomatis diambil dari database dan diberikan kepadamu.

Jawab pertanyaan user dengan jelas dan helpful. Kalau ditanya tentang code, berikan contoh yang relevan dengan struktur project ini.`;

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
