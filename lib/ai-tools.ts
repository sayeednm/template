import prisma from './prisma';

// Tools yang bisa digunakan AI untuk query database
export const aiTools = {
  // Get total users
  async getTotalUsers() {
    const count = await prisma.user.count();
    return { count, message: `Total ada ${count} user terdaftar` };
  },

  // Get users by role
  async getUsersByRole(role: 'ADMIN' | 'USER') {
    const users = await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return {
      count: users.length,
      users,
      message: `Ada ${users.length} user dengan role ${role}`,
    };
  },

  // Get all users with profiles
  async getAllUsers() {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      count: users.length,
      users: users.map((u) => ({
        email: u.email,
        role: u.role,
        hasFotoProfil: !!u.profile?.fotoProfil,
        createdAt: u.createdAt,
      })),
    };
  },

  // Get user statistics
  async getUserStats() {
    const [total, admins, regularUsers, withPhotos] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.profile.count({ where: { fotoProfil: { not: null } } }),
    ]);

    return {
      total,
      admins,
      regularUsers,
      withPhotos,
      message: `Statistik: Total ${total} user (${admins} admin, ${regularUsers} user biasa). ${withPhotos} user punya foto profil.`,
    };
  },

  // Search user by email
  async searchUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return { found: false, message: `User dengan email ${email} tidak ditemukan` };
    }

    return {
      found: true,
      user: {
        email: user.email,
        role: user.role,
        hasFotoProfil: !!user.profile?.fotoProfil,
        createdAt: user.createdAt,
      },
      message: `User ditemukan: ${user.email} (${user.role})`,
    };
  },

  // Get recent users
  async getRecentUsers(limit: number = 5) {
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      count: users.length,
      users,
      message: `${users.length} user terbaru`,
    };
  },
};

// Function to execute AI tool based on user query
export async function executeAITool(toolName: string, params?: any) {
  try {
    switch (toolName) {
      case 'getTotalUsers':
        return await aiTools.getTotalUsers();
      case 'getUsersByRole':
        return await aiTools.getUsersByRole(params.role);
      case 'getAllUsers':
        return await aiTools.getAllUsers();
      case 'getUserStats':
        return await aiTools.getUserStats();
      case 'searchUserByEmail':
        return await aiTools.searchUserByEmail(params.email);
      case 'getRecentUsers':
        return await aiTools.getRecentUsers(params.limit);
      default:
        return { error: 'Tool not found' };
    }
  } catch (error: any) {
    console.error('AI Tool error:', error);
    return { error: error.message };
  }
}

// Detect if user query needs database access
export function detectToolNeeded(query: string): { tool: string; params?: any } | null {
  const lowerQuery = query.toLowerCase();

  // Total users
  if (
    lowerQuery.includes('berapa user') ||
    lowerQuery.includes('jumlah user') ||
    lowerQuery.includes('total user') ||
    lowerQuery.includes('ada berapa')
  ) {
    return { tool: 'getUserStats' };
  }

  // Admin count
  if (
    lowerQuery.includes('berapa admin') ||
    lowerQuery.includes('jumlah admin') ||
    lowerQuery.includes('admin yang ada')
  ) {
    return { tool: 'getUsersByRole', params: { role: 'ADMIN' } };
  }

  // Regular users
  if (
    lowerQuery.includes('user biasa') ||
    lowerQuery.includes('non admin')
  ) {
    return { tool: 'getUsersByRole', params: { role: 'USER' } };
  }

  // List all users
  if (
    lowerQuery.includes('daftar user') ||
    lowerQuery.includes('list user') ||
    lowerQuery.includes('semua user') ||
    lowerQuery.includes('siapa saja')
  ) {
    return { tool: 'getAllUsers' };
  }

  // Recent users
  if (
    lowerQuery.includes('user terbaru') ||
    lowerQuery.includes('user baru')
  ) {
    return { tool: 'getRecentUsers', params: { limit: 5 } };
  }

  // Search by email
  const emailMatch = lowerQuery.match(/cari.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    return { tool: 'searchUserByEmail', params: { email: emailMatch[1] } };
  }

  return null;
}
