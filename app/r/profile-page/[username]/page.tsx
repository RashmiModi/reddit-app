import React from 'react';
import { getUserPostswithFirstName } from '@/app/action';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;
  const encodedUserName = encodeURIComponent(username);
  console.log("user-----> profilepage", username);
  const posts = await getUserPostswithFirstName(username);

  if (!posts) {
    return (
      <div>
        <h1>User Not Found</h1>
        <p>{`The user "${encodedUserName}" does not exist.`}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-center mb-4">{`Profile of ${encodedUserName}`}</h1>
        <p className="text-center text-gray-700 mb-6">{`Welcome to the profile page of ${encodedUserName}.`}</p>

        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        {posts.length > 0 ? (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-2">
                <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">This user has not posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
