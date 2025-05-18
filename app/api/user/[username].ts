// app/api/user/[username]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/redditdb';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user.posts);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
