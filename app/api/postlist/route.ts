// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subredditName = searchParams.get('subredditName');

  if (!subredditName) {
    return NextResponse.json({ error: 'Subreddit name is required' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        Subreddit: {
          name: subredditName,
        },
      },
      include: {
        user: true,
        Subreddit: true,
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
