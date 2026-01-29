"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import WalletConnect from "@/components/WalletConnect";
import ForumCard from "@/components/ForumCard";
import { forumApi, Forum } from "@/lib/api";
import { useAnchorProgram, voteOnChain } from "@/lib/anchor";
import { web3 } from "@coral-xyz/anchor";
import Link from "next/link";
import { PlusIcon } from "@/components/Icons";

export default function Home() {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForums();
  }, []);

  const loadForums = async () => {
    try {
      const data = await forumApi.getForums();

      // Fetch on-chain data for all forums if program is available
      if (program && data.length > 0) {
        try {
          const pubkeys = data.map((f) => new web3.PublicKey(f.forumId));
          const onChainDataList = await (
            program.account as any
          ).forumAccount.fetchMultiple(pubkeys);

          data.forEach((forum, i) => {
            const onChainData = onChainDataList[i] as any;
            if (onChainData) {
              forum.upvotes = onChainData.upvotes.toNumber();
              forum.downvotes = onChainData.downvotes.toNumber();
            }
          });
        } catch (err) {
          console.error("Failed to fetch on-chain forums data:", err);
        }
      }

      setForums(data);
    } catch (error) {
      console.error("Failed to load forums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (forumId: string, voteType: 1 | -1) => {
    if (!publicKey || !program) {
      alert("Please connect your wallet");
      return;
    }

    try {
      const forumPubkey = new web3.PublicKey(forumId);
      await voteOnChain(program, { publicKey }, forumPubkey, voteType);
      await loadForums(); // Reload to get updated vote counts from chain
    } catch (error: any) {
      console.error("Vote failed:", error);
      if (error.message?.includes("already in use")) {
        alert("You have already voted on this forum");
      } else {
        alert("Failed to vote. Please try again.");
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <h1 className="text-5xl font-bold bg-gradient-cyber bg-clip-text text-white mb-2">
            Janamat Forum
          </h1>
          <p className="text-gray-400">
            Privacy-preserving opinion sharing on Solana
          </p>
        </div>
        <WalletConnect />
      </motion.div>

      {/* Create Forum Button */}
      {publicKey && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Link href="/create">
            <button className="btn-primary flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create Forum
            </button>
          </Link>
        </motion.div>
      )}

      {/* Forum Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
          </div>
        ) : forums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 text-center"
          >
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              No forums yet
            </h3>
            <p className="text-gray-500">Be the first to create one!</p>
          </motion.div>
        ) : (
          forums.map((forum, index) => (
            <motion.div
              key={forum.forumId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ForumCard forum={forum} onVote={handleVote} />
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
