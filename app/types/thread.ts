import type { User } from "./user";

export enum ThreadStatus {
  ACTIVE = "active",
  LOCKED = "locked",
  FLAGGED = "flagged",
  ARCHIVED = "archived",
}

export interface Thread {
  _id: string;
  title: string;
  content: string;
  slug: string;
  author: User;
  status: ThreadStatus;
  isPinned: boolean;
  viewCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadDetail extends Thread {
  posts: Post[];
}

export interface Post {
  _id: string;
  content: string;
  author: User;
  threadId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThreadInput {
  title: string;
  content: string;
}

export interface CreatePostInput {
  content: string;
  threadId: string;
}
