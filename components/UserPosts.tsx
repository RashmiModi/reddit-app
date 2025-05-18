import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/user/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data);
     } catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("An unknown error occurred");
  }
}
    };

    fetchPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div>
      <h1>Your Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
            <h3>Comments:</h3>
            <ul>
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <li key={comment.id}>
                    <p>{comment.content}</p>
                    <p>Commented on: {new Date(comment.createdAt).toLocaleDateString()}</p>
                  </li>
                ))
              ) : (
                <li>No comments yet</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
