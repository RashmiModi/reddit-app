import { useState } from "react";

interface VoteButtonsProps {
  postId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  userVote: number | null;
}

export default function VoteButtons({
  postId,
  initialUpvotes,
  initialDownvotes,
  userVote: initialUserVote,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<number | null>(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVote = async (voteType: number) => {
    if (isVoting) {
      setErrorMessage("You have already voted.");
      return;
    }

    const newVote = userVote === voteType ? null : voteType;
    setIsVoting(true);

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, type: newVote }),
    });

    if (res.ok) {
      // Update upvotes/downvotes based on old and new vote
      if (userVote === 1) setUpvotes((prev) => prev - 1);
      if (userVote === -1) setDownvotes((prev) => prev - 1);

      if (newVote === 1) setUpvotes((prev) => prev + 1);
      if (newVote === -1) setDownvotes((prev) => prev + 1);

      setUserVote(newVote);
      setErrorMessage(null);
    } else {
      setErrorMessage("You already voted");
    }

    setIsVoting(false);
  };

    return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote(1)}
          className={`text-2xl ${userVote === 1 ? "text-blue-600" : "text-gray-400"}`}
          disabled={isVoting}
        >
           👍
        </button>
        <span className="text-lg">: {upvotes}</span>
        <button
          onClick={() => handleVote(-1)}
          className={`text-2xl ${userVote === -1 ? "text-red-600" : "text-gray-400"}`}
          disabled={isVoting}
        >
           👎
        </button>
        <span className="text-lg">: {downvotes}</span>
      </div>
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  );
}
