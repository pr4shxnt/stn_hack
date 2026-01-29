import express, { Router } from "express";
import Forum from "../models/Forum";
import { verifySignature, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router: Router = express.Router();

// Create a new forum
router.post("/", verifySignature, async (req: AuthRequest, res) => {
  try {
    const { forumId, title, description } = req.body;

    if (!forumId || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create forum in database
    const forum = new Forum({
      forumId,
      title,
      description,
      creator: req.walletAddress,
      createdAt: new Date(),
    });

    await forum.save();

    res.status(201).json({
      success: true,
      forum: {
        forumId: forum.forumId,
        title: forum.title,
        description: forum.description,
        creator: forum.creator,
        createdAt: forum.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create forum error:", error);
    res.status(500).json({ error: error.message || "Failed to create forum" });
  }
});

// Get all forums
router.get("/", async (req, res) => {
  try {
    const forums = await Forum.find().sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      forums,
    });
  } catch (error: any) {
    console.error("Get forums error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch forums" });
  }
});

// Get single forum by ID
router.get("/:forumId", async (req, res) => {
  try {
    const { forumId } = req.params;
    const forum = await Forum.findOne({ forumId });

    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    res.json({
      success: true,
      forum,
    });
  } catch (error: any) {
    console.error("Get forum error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch forum" });
  }
});

export default router;
