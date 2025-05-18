// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/redditdb"; // make sure this is your prisma client path

//onst prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        user: true,
        Subreddit: true,
        votes: true,
        comments: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
