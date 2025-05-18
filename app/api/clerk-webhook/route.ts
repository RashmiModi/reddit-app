// app/api/clerk-webhook/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/redditdb";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, email_addresses, username } = body;

  const email = email_addresses?.[0]?.email_address || "no-email@example.com";
  //const name =  username ;

  try {
    await prisma.user.create({
      data: {
        id,      // Clerk user ID
        email,
        username,
      },
    });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
