import mongoose, { Schema, Document } from "mongoose";

export interface IForum extends Document {
  forumId: string;
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
}

const ForumSchema = new Schema<IForum>({
  forumId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  creator: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.model<IForum>("Forum", ForumSchema);
