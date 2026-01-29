"use client";

import {
  Card as MuiCard,
  CardProps,
  CardContent,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberCardProps extends Omit<CardProps, "content" | "component"> {
  cyber?: boolean;
  content?: ReactNode;
  actions?: ReactNode;
}

export function Card({
  cyber = true,
  children,
  content,
  actions,
  sx,
  ...props
}: CyberCardProps) {
  const cardSx = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    "&:hover": {
      borderColor: "rgba(99, 102, 241, 0.3)",
    },
    ...sx,
  };

  if (!cyber) {
    return (
      <MuiCard sx={cardSx} {...props}>
        {content ? (
          <>
            <CardContent>{content}</CardContent>
            {actions && <CardActions>{actions}</CardActions>}
          </>
        ) : (
          children
        )}
      </MuiCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 0 30px rgba(167, 139, 250, 0.3)" }}
      transition={{ duration: 0.3 }}
    >
      <MuiCard sx={cardSx} {...props}>
        {content ? (
          <>
            <CardContent>{content}</CardContent>
            {actions && <CardActions>{actions}</CardActions>}
          </>
        ) : (
          children
        )}
      </MuiCard>
    </motion.div>
  );
}
