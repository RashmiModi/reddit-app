// app/posts/[id]/page.tsx

import { use } from 'react';
import { fetchPostById } from '@/app/action';

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = use(fetchPostById(id));

  if (!post) {
    return <div>Post not found</div>;
  }

  // Calculate vote count
  const voteCount = post.votes.reduce((total, vote) => {
    return vote.type === 1 ? total + 1 : total - 1;
  }, 0);

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl mt-4">
    <h1 className="text-pink-900 font-semibold text-lg">{post.title}</h1>
    <p>By {post.user.username}</p>
    <h2 className="text-blue-600 font-semibold text-lg">
      <p>Votes: {voteCount}</p>
    </h2>
    <section>
      <h2 className="text-green-600 font-semibold text-lg">Comments</h2>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        post.comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <p>
              <strong>{comment.user.username}</strong>: {comment.content}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </section>
  </div>
</div>


  );
}
