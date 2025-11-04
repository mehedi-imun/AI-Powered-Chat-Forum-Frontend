export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  displayName?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile extends User {
  threadCount: number;
  postCount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
