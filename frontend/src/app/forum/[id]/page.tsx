"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import WalletConnect from "@/components/WalletConnect";
import VoteButton from "@/components/VoteButton";
import { forumApi, Forum, Comment } from "@/lib/api";
import { useAnchorProgram, voteOnChain } from "@/lib/anchor";
import { web3 } from "@coral-xyz/anchor";
import bs58 from "bs58";
import Link from "next/link";

export default function ForumThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const program = useAnchorProgram();

  const [forum, setForum] = useState<Forum | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadThread();
    }
  }, [params.id]);

  const loadThread = async () => {
    try {
      const [forumData, commentsData] = await Promise.all([
        forumApi.getForum(params.id as string),
        forumApi.getComments(params.id as string),
      ]);

      // Fetch on-chain data if program is available
      if (program) {
        try {
          const forumPubkey = new web3.PublicKey(params.id as string);
          const onChainData = await (program.account as any).forumAccount.fetch(
            forumPubkey,
          );
          forumData.upvotes = onChainData.upvotes.toNumber();
          forumData.downvotes = onChainData.downvotes.toNumber();
        } catch (err) {
          console.error("Failed to fetch on-chain forum data:", err);
        }
      }

      setForum(forumData);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to load thread:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 1 | -1) => {
    if (!publicKey || !program || !forum) {
      alert("Please connect your wallet");
      return;
    }

    try {
      const forumPubkey = new web3.PublicKey(forum.forumId);
      await voteOnChain(program, { publicKey }, forumPubkey, voteType);
      await loadThread(); // Reload to get updated vote counts
    } catch (error: any) {
      console.error("Vote failed:", error);
      if (error.message?.includes("already in use")) {
        alert("You have already voted on this forum");
      } else {
        alert("Failed to vote. Please try again.");
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !signMessage || !forum) {
      alert("Please connect your wallet");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setSubmitting(true);

    try {
      const message = `Comment on ${forum.forumId}: ${newComment}`;
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);

      await forumApi.createComment({
        forumId: forum.forumId,
        content: newComment,
        message,
        signature: bs58.encode(signature),
        publicKey: publicKey.toBase58(),
      });

      setNewComment("");
      await loadThread();
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!forum) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-panel p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-400">
            Forum not found
          </h2>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Link
          href="/"
          className="text-cyber-cyan hover:text-cyber-purple transition-colors"
        >
          ← Back to Forums
        </Link>
        <WalletConnect />
      </motion.div>

      {/* Forum Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-white">
          {forum.title}
        </h1>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">
          {forum.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <VoteButton
            upvotes={forum.upvotes || 0}
            downvotes={forum.downvotes || 0}
            onVote={handleVote}
          />
          <div className="text-sm text-gray-500">
            by {truncateAddress(forum.creator)}
          </div>
        </div>
      </motion.div>

      {/* Comment Form */}
      {publicKey && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitComment}
          className="glass-panel p-6 mb-8"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={2000}
            rows={4}
            className="input-cyber resize-none mb-3"
            disabled={submitting}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {newComment.length}/2000
            </span>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </motion.form>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <div className="glass-panel p-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.commentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-cyber-cyan">
                  {truncateAddress(comment.authorWallet)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
