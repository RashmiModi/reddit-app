// app/api/posts/recent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/redditdb';

export const revalidate = 60; // Optional: Cache the response for 60 seconds

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        id: true,
        title: true,
        imageString: true,
        createdAt: true,
        updatedAt: true,
        subName: true,
        userId: true,
        Subreddit: true,
        user: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return new NextResponse('Failed to fetch recent posts', { status: 500 });
  }
}
