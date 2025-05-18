import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/redditdb'; // Adjust the import path as necessary
import { getAuth } from '@clerk/nextjs/server'; // Server-side Clerk authentication

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Retrieve the authenticated user's information
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Fetch the user's details from the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch posts authored by the user, including comments
      const posts = await prisma.post.findMany({
        where: {
          user: {
            username: user.username,
          },
        },
        include: {
          comments: true, // Include comments for each post
        },
        orderBy: {
          createdAt: 'desc', // Order posts by creation date
        },
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
