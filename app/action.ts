"use server";

import prisma from "@/lib/redditdb";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache'; 
import { JSONContent } from '@tiptap/react';

declare global {
  interface Error {
    code?: string | number;
  }
}
export async function createCommunity(formData: FormData) {
  const { userId } = await auth(); 
  if (!userId) return redirect("/");
console.log("userId----> signin", userId);
  const user = await currentUser(); 

  // Ensure user exists in your DB
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      username: user?.username || user?.fullName || "Anonymous",
      email: user?.emailAddresses?.[0]?.emailAddress || "no-email@example.com",
    },
  });

  const community_name = formData.get("community_name") as string;
  console.log("community---->", community_name);

  if (community_name) {
    try {
      const data = await prisma.subreddit.create({
        data: {
          name: community_name,
          userId: userId,
        },
      });
      console.log("data---->", data);
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.code === "P2002") {
        // Handle the unique constraint error
      }
    }

  return redirect("/r/list"); // Redirect to homepage or another page
}
}

interface FormState {
  message: string;
  status: string;
}
export async function updateCommunityDescription(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  try {
    const comid = formData.get('id') as string;
    const description = formData.get('description') as string;

    await prisma.subreddit.update({
      where: { id: comid },
      data: { description },
    });

    // Invalidate the cache for the specific subreddit page
    revalidatePath(`/r/${comid}`);

    return {
      status: 'green',
      message: 'Description updated successfully',
    };
  } catch (error: unknown) {
    console.error('Error updating description:', error);
    return {
      status: 'red',
      message: 'Sorry, could not update description',
      
    };
    
  }
  
}

export async function getSubreddits() {
  return await prisma.subreddit.findMany({
    orderBy: { createdAt: 'desc' },
      include: {
      user: true, // Include the related user
    },
  });
}


export async function createPost({jsonContent}: {jsonContent:JSONContent|null },formData: FormData) {
 const { userId } = await auth(); 
  if (!userId) return redirect("/");
  console.log("userId----> signin", userId);
 const title = formData.get("title") as string;
 const imageUrl = formData.get("imageUrl") as string|null;
 //const subredditId = formData.get("subredditId") as string;
const rawSubName = formData.get("subName") as string;
const subName = decodeURIComponent(rawSubName.trim());
console.log("Decoded subName:", subName);
await prisma.post.create({
 
  data: {
      title: title,
      imageString: imageUrl ?? undefined,
      user: {
        connect: { id: userId }
      },
     Subreddit: {
        connect: { name: subName }
      },
       textContent:jsonContent?? undefined,     
  }
  });

 return redirect("/");// Redirect to the subreddit page
} 



//getPostsBySubredditName.ts

// Ensure prisma is correctly initialized

export async function getPostsBySubredditName(subredditName: string) {
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
        comments: {
          include: { user: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log("post data-----> action.ts", posts);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for subreddit ${subredditName}:`, error);
    throw new Error('Database error');
  }
}



export async function getUserWithPosts(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return user;
}


 export async function getUserPosts(username: string) {

  console.log("parameter of function getuserposts---->>>",username)
  const user = await prisma.user.findUnique({
    where: { username },
    include: { posts: true },
  });

  return user?.posts || [];
}


export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        Subreddit: true,
        votes: true,
        comments: true,
      },
    })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}



export async function fetchPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { username: true },
        },
        comments: {
          include: {
            user: {
              select: { username: true },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        votes: true, // Include votes
      },
    });

    return post;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}


export async function getUserPostswithFirstName(prefix: string) {
  console.log("parameter of function getUserPosts ---->>>", prefix);

  const user = await prisma.user.findFirst({
    where: {
      username: {
        startsWith: prefix,
        mode: 'insensitive', // optional
      },
    },
    include: {
      posts: true,
    },
  });

  return user?.posts || [];
}
