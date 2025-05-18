'use client';

import { Button } from '@/components/ui/button'; // Ensure this path is correct
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubreddits } from '@/app/action';
import { Separator } from "@/components/ui/separator";

// Define the User interface
interface User {
  id: string;
  email: string;
  username: string;
}

// Define the Subreddit interface
interface Subreddit {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string | null;
  description: string | null;
  user: User | null;
}

export default function SubredditList() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    async function fetchSubreddits() {
      try {
        const data = await getSubreddits();
        setSubreddits(
          data.map((subreddit: Subreddit) => ({
            ...subreddit,
            user: subreddit.user ?? {
              id: '',
              email: '',
              username: 'Unknown',
            },
          }))
        );
      } catch (error) {
        console.error('Error fetching subreddits:', error);
      }
    }

    fetchSubreddits();
  }, []);

  return (
    <div className="p-4">
      {/* Create New Subreddit Button */}
      <div className="mb-6">
        <Link href="/r/create">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            + Create New Subreddit
          </Button>
        </Link>
      </div>

      {/* Subreddit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subreddits.map((subreddit) => (
          <div
            key={subreddit.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              <Link href={`/r/${encodeURIComponent(subreddit.name)}`}>
                r/{subreddit.name}
              </Link>
            </h2>
            <p className="text-gray-600">
              Join the discussion in r/{subreddit.name}
            </p>

            <Separator className="my-2 mx-1" />

            <p className="text-muted-foreground font-medium text-sm">
              Created:{' '}
              {new Date(subreddit.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <p className="text-gray-600">
              Created by:{' '}
              <Link
                href={`/r/profile-page/${subreddit.user?.username}`}
                className="text-blue-500 hover:underline"
              >
                {subreddit.user?.username}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
