// subredditService.ts
import prisma from "@/lib/redditdb";

export async function getSubReddit(name: string) {

  const subName =decodeURIComponent(name)
  console.log(subName)
  const data = await prisma.subreddit.findFirst({
    where: {
      name: {
        equals: subName,
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      userId: true,
      posts: {
        include: {
          votes: true,
        },
      },
    },
  });
  return data;
}