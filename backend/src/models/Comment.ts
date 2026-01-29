import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  commentId: string;
  forumId: string;
  authorWallet: string;
  content: string;
  parentCommentId?: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  commentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  forumId: {
    type: String,
    required: true,
    index: true,
  },
  authorWallet: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  parentCommentId: {
    type: String,
    default: null,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
