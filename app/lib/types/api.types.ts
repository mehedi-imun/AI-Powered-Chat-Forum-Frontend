/**
 * API Response Types
 * Centralized type definitions for all API responses
 */

// Base API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

// Error Response
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "Admin" | "Moderator" | "Member";
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserProfile = User;

export interface UserStats {
  totalPosts: number;
  totalThreads: number;
  totalReplies: number;
  unreadNotifications: number;
  reputation?: number;
  profileViews?: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Thread Types
export interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  views: number;
  likes: number;
  replies: number;
  isLocked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadDetail extends Thread {
  posts: Post[];
}

// Post Types
export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  threadId: string;
  likes: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType =
  | "NEW_REPLY"
  | "NEW_THREAD"
  | "LIKE"
  | "MENTION"
  | "FOLLOW"
  | "SYSTEM"
  | "MODERATION"
  | "ACHIEVEMENT"
  | "REPORT"
  | "BAN";

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  totalPages: number;
  unreadCount: number;
  page: number;
  limit: number;
}

// Form Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Action Response Types
export interface ActionSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ActionError {
  success: false;
  error: string;
  message?: string;
}

export type ActionResponse<T = unknown> = ActionSuccess<T> | ActionError;
