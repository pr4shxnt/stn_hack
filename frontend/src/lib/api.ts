import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Forum {
  forumId: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  upvotes?: number;
  downvotes?: number;
}

export interface Comment {
  commentId: string;
  forumId: string;
  authorWallet: string;
  content: string;
  parentCommentId?: string;
  createdAt: string;
}

export const forumApi = {
  async getForums(): Promise<Forum[]> {
    const response = await axios.get(`${API_BASE_URL}/forum`);
    return response.data.forums;
  },

  async getForum(forumId: string): Promise<Forum> {
    const response = await axios.get(`${API_BASE_URL}/forum/${forumId}`);
    return response.data.forum;
  },

  async createForum(data: {
    forumId: string;
    title: string;
    description: string;
    message: string;
    signature: string;
    publicKey: string;
  }): Promise<Forum> {
    const response = await axios.post(`${API_BASE_URL}/forum`, data);
    return response.data.forum;
  },

  async getComments(forumId: string): Promise<Comment[]> {
    const response = await axios.get(`${API_BASE_URL}/comment/${forumId}`);
    return response.data.comments;
  },

  async createComment(data: {
    forumId: string;
    content: string;
    parentCommentId?: string;
    message: string;
    signature: string;
    publicKey: string;
  }): Promise<Comment> {
    const response = await axios.post(`${API_BASE_URL}/comment`, data);
    return response.data.comment;
  },
};
