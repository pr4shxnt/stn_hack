"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "./Icons";

interface VoteButtonProps {
  upvotes: number;
  downvotes: number;
  onVote: (voteType: 1 | -1) => void;
  disabled?: boolean;
}

export default function VoteButton({
  upvotes,
  downvotes,
  onVote,
  disabled,
}: VoteButtonProps) {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalUpvotes(upvotes);
    setLocalDownvotes(downvotes);
  }, [upvotes, downvotes]);

  const handleVote = (type: 1 | -1) => {
    // Optimistic UI update
    if (type === 1) {
      setLocalUpvotes((prev) => prev + 1);
    } else {
      setLocalDownvotes((prev) => prev + 1);
    }
    onVote(type);
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(1)}
        disabled={disabled}
        className="flex items-center gap-1 px-3 py-2 glass-panel hover:bg-cyber-purple/20 rounded-lg transition-all"
      >
        <ArrowUpIcon className="w-5 h-5 text-cyber-cyan" />
        <span className="text-sm font-semibold">{localUpvotes}</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(-1)}
        disabled={disabled}
        className="flex items-center gap-1 px-3 py-2 glass-panel hover:bg-cyber-magenta/20 rounded-lg transition-all"
      >
        <ArrowDownIcon className="w-5 h-5 text-cyber-magenta" />
        <span className="text-sm font-semibold">{localDownvotes}</span>
      </motion.button>
    </div>
  );
}
