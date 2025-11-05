export const ADMIN_ROUTES = {
  HOME: "/admin",
  USERS: "/admin/users",
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  THREADS: "/admin/threads",
  THREAD_DETAIL: (id: string) => `/admin/threads/${id}`,
  MODERATION: "/admin/moderation",
  REPORTS: "/admin/reports",
  SETTINGS: "/admin/settings",
  ANALYTICS: "/admin/analytics",
} as const;
