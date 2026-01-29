"use client";

import { motion } from "framer-motion";
import VoteButton from "./VoteButton";
import { CommentIcon } from "./Icons";
import Link from "next/link";

interface ForumCardProps {
  forum: {
    forumId: string;
    title: string;
    description: string;
    creator: string;
    createdAt: string;
    upvotes?: number;
    downvotes?: number;
  };
  onVote: (forumId: string, voteType: 1 | -1) => void;
}

export default function ForumCard({ forum, onVote }: ForumCardProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 0 30px rgba(167, 139, 250, 0.3)" }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-6 hover:border-cyber-purple/30 transition-all"
    >
      <Link href={`/forum/${forum.forumId}`}>
        <h3 className="text-2xl text-white font-bold mb-3 bg-gradient-cyber bg-clip-text hover:opacity-80 transition-opacity">
          {forum.title}
        </h3>
      </Link>

      <p className="text-gray-300 mb-4 line-clamp-3">{forum.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VoteButton
            upvotes={forum.upvotes || 0}
            downvotes={forum.downvotes || 0}
            onVote={(type) => onVote(forum.forumId, type)}
          />

          <Link href={`/forum/${forum.forumId}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 glass-panel hover:bg-white/10 rounded-lg transition-all"
            >
              <CommentIcon className="w-5 h-5 text-cyber-glow" />
              <span className="text-sm">Discuss</span>
            </motion.button>
          </Link>
        </div>

        <div className="text-xs text-gray-500">
          by {truncateAddress(forum.creator)}
        </div>
      </div>
    </motion.div>
  );
}
