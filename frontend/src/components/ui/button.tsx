"use client";

import { Button as MuiButton, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";

interface CyberButtonProps extends Omit<ButtonProps, "component"> {
  cyber?: boolean;
}

export function Button({
  cyber = true,
  children,
  sx,
  ...props
}: CyberButtonProps) {
  if (!cyber) {
    return (
      <MuiButton
        sx={{
          textTransform: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: 600,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: "inline-block" }}
    >
      <MuiButton
        sx={{
          textTransform: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: 600,
          background:
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    </motion.div>
  );
}
