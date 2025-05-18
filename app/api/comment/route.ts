import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/redditdb"; // make sure this is your prisma client path

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { postId, content } = body;

  if (!postId || !content) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  try {
    // Create comment in the database
    const newComment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId, // Ensure the userId is being passed correctly
      },
      include: {
         user: {
          select: {
            username: true, // Only return username to match your frontend interface
          },
        }, // Include user details (e.g., username)
      },
    });

    // Return the new comment, including user details
    console.log("User name who created a comment :", newComment.user.username);
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
