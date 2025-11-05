/**
 * Application Constants
 * Centralized constants for the application
 */

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  
  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_NOTIFICATIONS: "/dashboard/notifications",
  
  // Threads
  THREADS: "/threads",
  THREAD_DETAIL: (id: string) => `/threads/${id}`,
  THREAD_SEARCH: "/threads/search",
  
  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_THREADS: "/admin/threads",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  MEMBER: "Member",
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_REPLY: "NEW_REPLY",
  NEW_THREAD: "NEW_THREAD",
  LIKE: "LIKE",
  MENTION: "MENTION",
  FOLLOW: "FOLLOW",
  SYSTEM: "SYSTEM",
  MODERATION: "MODERATION",
  ACHIEVEMENT: "ACHIEVEMENT",
  REPORT: "REPORT",
  BAN: "BAN",
} as const;

// Notification Config
export const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.NEW_REPLY]: {
    icon: "MessageSquare",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  [NOTIFICATION_TYPES.NEW_THREAD]: {
    icon: "FileText",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  [NOTIFICATION_TYPES.LIKE]: {
    icon: "Heart",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  [NOTIFICATION_TYPES.MENTION]: {
    icon: "AtSign",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  [NOTIFICATION_TYPES.FOLLOW]: {
    icon: "UserPlus",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    icon: "Bell",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  [NOTIFICATION_TYPES.MODERATION]: {
    icon: "Shield",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  [NOTIFICATION_TYPES.ACHIEVEMENT]: {
    icon: "Award",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  [NOTIFICATION_TYPES.REPORT]: {
    icon: "Flag",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  [NOTIFICATION_TYPES.BAN]: {
    icon: "Ban",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  NOTIFICATIONS_LIMIT: 10,
  THREADS_LIMIT: 20,
  USERS_LIMIT: 20,
} as const;

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  THREAD_TITLE_MIN_LENGTH: 10,
  THREAD_TITLE_MAX_LENGTH: 200,
  POST_CONTENT_MIN_LENGTH: 10,
  POST_CONTENT_MAX_LENGTH: 5000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
} as const;

// Time Constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// Success/Error Messages
export const MESSAGES = {
  // Success
  LOGIN_SUCCESS: "Logged in successfully!",
  REGISTER_SUCCESS: "Account created! Please verify your email.",
  PROFILE_UPDATED: "Profile updated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  EMAIL_VERIFIED: "Email verified successfully!",
  
  // Errors
  LOGIN_FAILED: "Invalid email or password",
  REGISTER_FAILED: "Failed to create account",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue",
  FORBIDDEN: "You don't have permission to access this resource",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  
  // Validation
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_MISMATCH: "Passwords do not match",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
} as const;
