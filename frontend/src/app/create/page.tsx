"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WalletConnect from "@/components/WalletConnect";
import { forumApi } from "@/lib/api";
import { useAnchorProgram, createForumOnChain } from "@/lib/anchor";
import bs58 from "bs58";
import Link from "next/link";

export default function CreateForumPage() {
  const { publicKey, signMessage } = useWallet();
  const program = useAnchorProgram();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !signMessage || !program) {
      alert("Please connect your wallet");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Create forum on-chain
      const forumId = await createForumOnChain(program, { publicKey });

      // Sign message for backend
      const message = `Create forum: ${title}`;
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);

      // Store metadata off-chain
      await forumApi.createForum({
        forumId,
        title,
        description,
        message,
        signature: bs58.encode(signature),
        publicKey: publicKey.toBase58(),
      });

      alert("Forum created successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Create forum error:", error);
      if (error.message?.includes("already in use")) {
        alert(
          "You have already created a forum today. Please try again tomorrow.",
        );
      } else {
        alert("Failed to create forum. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <Link
            href="/"
            className="text-cyber-cyan hover:text-cyber-purple transition-colors mb-4 inline-block"
          >
            ← Back to Forums
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
            Create Forum
          </h1>
        </div>
        <WalletConnect />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-panel p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="Enter forum title..."
            className="input-cyber"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">{title.length}/200</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={5000}
            rows={8}
            placeholder="Share your thoughts..."
            className="input-cyber resize-none"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {description.length}/5000
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !publicKey}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Forum"}
        </motion.button>

        {!publicKey && (
          <p className="text-sm text-center text-yellow-500">
            Please connect your wallet to create a forum
          </p>
        )}

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• You can create one forum per day</p>
          <p>• Your wallet signature will be required</p>
          <p>• All forums are public and permanent</p>
        </div>
      </motion.form>
    </main>
  );
}
