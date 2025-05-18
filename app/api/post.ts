// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPostsBySubredditName } from '@/app/action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subredditName } = req.query;
console.log("subredditName-----> post.ts", subredditName);
  if (typeof subredditName !== 'string') {
    res.status(400).json({ error: 'Invalid subreddit name' });
    return;
  }

try {
    const posts = await getPostsBySubredditName(subredditName);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
}