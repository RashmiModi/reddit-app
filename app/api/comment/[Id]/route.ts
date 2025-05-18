import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/redditdb"; // Ensure this path is correct

export async function PATCH(
  req: Request,
  context: { params: Promise<{ Id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { Id } = await context.params;

  if (!Id) {
    return new NextResponse("Comment ID is required", { status: 400 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content) {
    return new NextResponse("Content is required", { status: 400 });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Id },
      include: { user: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Forbidden: You can only edit your own comments", { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Id },
      data: { content },
    });

    console.log(updatedComment);
    return NextResponse.json({ success: true, comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ Id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { Id } = await context.params;

  if (!Id) {
    return new NextResponse("Comment ID is required", { status: 400 });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Id },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Forbidden: You can only delete your own comments", { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: Id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
