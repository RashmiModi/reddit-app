import { auth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";
import prisma from "@/lib/redditdb"; // your prisma client

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { postId, type } = body;

  if (!postId || ![-1, 0, 1].includes(type)) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  try {
    const existingVote = await prisma.vote.findFirst({
      where: { postId, userId },
    });

    if (existingVote) {
      // If the user has already voted, we update or delete the existing vote
      if (type === 0) {
        // If type is 0, remove the vote
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
      } else if (existingVote.type !== type) {
        // If type has changed (upvote to downvote or vice versa), update it
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
      }
    } else if (type !== 0) {
      // If no vote exists, create a new one
      await prisma.vote.create({
        data: {
          postId,
          userId,
          type,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing vote:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
