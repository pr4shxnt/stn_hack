"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WalletConnect() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WalletMultiButton className="btn-primary bg-gradient-cyber!" />
      {publicKey && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-xs text-cyber-cyan"
        >
          Connected: {publicKey.toBase58().slice(0, 4)}...
          {publicKey.toBase58().slice(-4)}
        </motion.div>
      )}
    </motion.div>
  );
}
