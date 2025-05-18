"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SubDescriptionForm } from "@/components/SubDescriptionForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import VoteButtons from '@/components/VoteButtons';



interface CommunityInfoProps {
  data: {
    id: string;
    name: string;
    createdAt: Date | string;
    description: string | null;
    userId: string | null;
  };
}

interface Post {
  id: string;
  title: string;
   textContent: string | Block[];
  imageString?: string;
   createdAt: string;
  votes: Vote[];
  comments: Comment[];
  
}
export interface Vote {
  id: number;
  type: number;
  userId: string;
  postId: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
  postId: string;
  userId: string;
  isNew?: boolean;
}
interface Span {
  text: string;
}

interface Block {
  type: string;
  content?: Span[];
}
export default function CommunityInfo({ data }: CommunityInfoProps) {
  const { isLoaded, userId } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postComments, setPostComments] = useState<{ [postId: string]: Comment[] }>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [expandedPosts, setExpandedPosts] = useState<{ [postId: string]: boolean }>({});
const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
const [sortByVotes, setSortByVotes] = useState<boolean>(false);


  useEffect(() => {
    if (isLoaded && userId) {
      setCurrentUserId(userId);
    }

    const fetchPosts = async () => {
      try {
        console.log("subredditName-->community info--->",data.name)
        const response = await fetch(`/api/postlist?subredditName=${data.name}`);
        if (!response.ok) {
          
            if (response.status === 400) {
        setPosts([]);
        setErrorMessage("No posts found.");
         <div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
         </div>
      
      }
          throw new Error(`fetch post error--->: ${response.status}`);}
        const jsonData = await response.json();
        setPosts(jsonData);

        // Initialize postComments for each post
        const initialComments: { [postId: string]: Comment[] } = {};
        jsonData.forEach((post: Post) => {
          initialComments[post.id] = post.comments || [];
        });
        setPostComments(initialComments);
      }  catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('An unexpected error occurred');
  }
}
    };

    fetchPosts();
  }, [data.name, isLoaded, userId,errorMessage]);

const handleCommentChange = (postId: string, value: string) => {
  setCommentInputs((prev) => ({
    ...prev,
    [postId]: value,
  }));
};


const handleCommentSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  postId: string
) => {
  e.preventDefault();

  const content = commentInputs[postId];
  if (!content.trim()) return;

  try {
    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, postId }),
    });

    if (res.ok) {
      const responseData = await res.json();
      const newComment: Comment = responseData.comment;

      // Update the comments for the specific post
      setPostComments((prev) => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])],
      }));

      // Clear the input field
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: '',
      }));
    } else {
      console.error('Failed to post comment');
    }
  } catch (error) {
    console.error('Error posting comment:', error);
  }
};

 const handleEditClick = (postId: string, comment: Comment) => {
  setEditingCommentId(comment.id);  // Set the ID of the comment being edited
  setEditContent(comment.content);  // Set the content of the comment to be edited
};

const handleCancelEdit = () => {
  setEditingCommentId(null);
  setEditContent('');
};

const handleUpdateComment = async (postId: string, commentId: string) => {
  if (!editContent.trim()) return;

  try {
    const res = await fetch(`/api/comment/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });

    if (res.ok) {
      const { comment: updatedComment } = await res.json();

      setPostComments(prev => {
        const updatedComments = prev[postId].map(comment =>
          comment.id === updatedComment.id
            ? { ...comment, content: updatedComment.content }
            : comment
        );
        return { ...prev, [postId]: updatedComments };
      });

      setEditingCommentId(null);
      setEditContent('');
    } else {
      console.error('Failed to update comment');
    }
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const res = await fetch(`/api/comment/${commentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPostComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }));
    } else {
      console.error("Failed to delete comment");
    }
  };
/*const handleVoteUpdate = (postId: string, updatedVotes: Vote[]) => {
  setPosts(prevPosts =>
    prevPosts.map(post =>
      post.id === postId ? { ...post, votes: updatedVotes } : post
    )
  );
};*/
  if (!isLoaded) return null;

  return (
    <div className="flex gap-2">
      {/* Post List */}
      <div className="w-full md:w-2/4 lg:w-3/5">
        <h3 className="text-lg font-semibold">Posts</h3>
        <div className="flex items-center gap-2 my-2">
  <label htmlFor="sort" className="text-sm font-medium">
    Sort by:
  </label>
  <select
    id="sort"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
    className="border border-gray-300 rounded px-2 py-1 text-sm"
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>
<div className="flex items-center gap-2 my-2">
  <input
    type="checkbox"
    id="voteSort"
    checked={sortByVotes}
    onChange={(e) => setSortByVotes(e.target.checked)}
    className="accent-blue-600"
  />
  <label htmlFor="voteSort" className="text-sm">
    Sort by top votes
  </label>
</div>
        {posts.length === 0 ? (
  <p className="text-muted-foreground mt-4">
    No posts yet. Be the first to{" "}
    <Link href={`/r/${data.name}/createpost`} className="text-blue-600 underline">
      post
    </Link>
    !
  </p>
) : (
          <div className="space-y-4">
          
            
           {[...posts]
  .sort((a, b) => {
     if (sortByVotes) {
      const aVotes = a.votes.filter(v => v.type === 1).length - a.votes.filter(v => v.type === -1).length;
      const bVotes = b.votes.filter(v => v.type === 1).length - b.votes.filter(v => v.type === -1).length;
      return bVotes - aVotes;
    }
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  })
  .map((post) => {
 const upvotes = post.votes.filter((v) => v.type === 1).length;
const downvotes = post.votes.filter((v) => v.type === -1).length;
const userVote = post.votes.find((v) => v.userId ===userId)?.type ?? null;
           
              const commentsForPost = postComments[post.id] || [];
              return (
                <Card key={post.id} className="p-4">
                  <h4 className="font-bold text-base mb-2">{post.title}</h4>
<h5 className="font-bold text-base mb-2">{post.createdAt}</h5>
                 {post.imageString && (
                    <Image
                      src={post.imageString}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="rounded"
                    />
                  )}

               {typeof post.textContent === 'string' ? (
  <p className="text-sm mt-2">{post.textContent}</p>
) : (
  Array.isArray(post.textContent) &&
  post.textContent.map((block: Block, i: number) => {
    if (block.type === 'paragraph' && block.content) {
      return (
        <p key={i} className="text-sm mt-2">
          {block.content.map((span: Span) => span.text).join('')}
           <div>
    {errorMessage && <p>{errorMessage}</p>}
    {/* other JSX */}
  </div>
        </p>
      );
    }
    return null;
  })
)}
<VoteButtons
  postId={post.id}
  initialUpvotes={upvotes}
  initialDownvotes={downvotes}
  userVote={userVote}
/>


                  {/* Comment Form */}
 <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-4">
  <textarea
    value={commentInputs[post.id] || ''}
    onChange={(e) => handleCommentChange(post.id, e.target.value)}
    placeholder="Write your comment here..."
    rows={4}
    className="w-full border px-2 py-1 rounded" required
  />
  <button
    type="submit" 
    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
  >
    Post Comment
  </button>
</form>
                 

 {/* Comment List */}
<div className="space-y-2 mt-2 text-sm">
  {commentsForPost
    .slice(
      0,
      expandedPosts[post.id] ? commentsForPost.length : 2 // Show 2 if not expanded
    )
    .map((comment) => (
      <div
        key={comment.id}
        className={`border-l-2 pl-2 text-muted-foreground flex justify-between items-start ${
          comment.isNew ? 'bg-yellow-50' : ''
        }`}
      >
        {editingCommentId === comment.id ? (
          <div className="w-full">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-sm w-full border px-2 py-1 rounded"
            />
            <div className="flex gap-2 mt-1 text-xs">
              <button
                onClick={() => handleUpdateComment(post.id, comment.id)}
                className="text-green-600 hover:underline"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <span className="font-semibold">{comment.user?.username}:</span> {comment.content}
            </div>

            {comment.userId === currentUserId && (
              <div className="flex gap-2 ml-2 text-xs">
                <button
                  onClick={() => handleEditClick(post.id, comment)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(post.id, comment.id)}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    ))}

  {/* Load more / show less toggle */}
  {commentsForPost.length > 2 && (
    <button
      onClick={() =>
        setExpandedPosts((prev) => ({
          ...prev,
          [post.id]: !prev[post.id],
        }))
      }
      className="text-xs text-blue-500 hover:underline"
    >
      {expandedPosts[post.id] ? 'Show less' : `View more comments (${commentsForPost.length - 2})`}
    </button>
  )}
</div>

                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar - About Community */}
      <div className="w-full md:w-3/4 lg:w-2/3">
        <Card className="h-full p-4">
          <div className="bg-muted p-4 font-semibold">About community</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.name}`}
                alt="Image of subreddit"
                width={80}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/r/${data?.name}`} className="font-medium">
                r/{data?.name}
              </Link>
            </div>

            {currentUserId === data?.userId ? (
              <SubDescriptionForm
                description={data?.description}
                subName={data?.id}
              />
            ) : (
              <p className="text-sm font-normal text-secondary-foreground mt-2">
                {data?.description}
              </p>
            )}

            {data.createdAt && (
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-muted-foreground font-medium text-sm">
                  Created:{' '}
                  {new Date(data.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Separator className="my-2" />
                <Button asChild className="rounded-full self-start">
                  <Link href={`/r/${data.name}/createpost`}>Create Post</Link>
                </Button>
              </div>
            )}
          </div>
         
        </Card>
      </div>
    </div>
  );
}
