import express, { Router } from "express";
import Comment from "../models/Comment";
import { verifySignature, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router: Router = express.Router();

// Create a comment
router.post("/", verifySignature, async (req: AuthRequest, res) => {
  try {
    const { forumId, content, parentCommentId } = req.body;

    if (!forumId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = new Comment({
      commentId: uuidv4(),
      forumId,
      authorWallet: req.walletAddress,
      content,
      parentCommentId: parentCommentId || null,
      createdAt: new Date(),
    });

    await comment.save();

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error: any) {
    console.error("Create comment error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create comment" });
  }
});

// Get comments for a forum
router.get("/:forumId", async (req, res) => {
  try {
    const { forumId } = req.params;
    const comments = await Comment.find({ forumId }).sort({ createdAt: 1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error: any) {
    console.error("Get comments error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch comments" });
  }
});

export default router;
