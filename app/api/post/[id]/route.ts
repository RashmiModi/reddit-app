import { NextResponse } from 'next/server';
import prisma from "@/lib/redditdb"; // make sure this is your prisma client path

//const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subredditName = url.searchParams.get('subredditName');
console.log(subredditName);
  if (!subredditName) {
    return NextResponse.json({ error: 'Subreddit name is required' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { Subreddit: { name: subredditName } },
      include: {
        user: true,
        Subreddit: true,
        votes: true,
        comments: true,
      },
    });

    if (posts.length === 0) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
