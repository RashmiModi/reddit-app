// app/posts/[id]/page.tsx



import { fetchPostById } from '@/app/action';

// Define interfaces for Vote, Comment, and Post
interface Vote {
  type: number; // 1 for upvote, -1 for downvote
}

interface Comment {
  id: string;
  user: {
    username: string;
  };
  content: string;
  createdAt: Date; // Updated to Date to match the actual data type
}

interface Post {
  title: string;
  user: {
    username: string;
  };
  votes: Vote[];
  comments: Comment[];
}

// Define the props for PostPage


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post: Post | null = await fetchPostById(id);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Calculate vote count
  const voteCount = post.votes.reduce((total: number, vote: Vote) => {
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
            post.comments.map((comment: Comment) => (
              <div key={comment.id} className="mb-4">
                <p>
                  <strong>{comment.user.username}</strong>: {comment.content}
                </p>
                <p className="text-sm text-gray-500">
                  {comment.createdAt.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}