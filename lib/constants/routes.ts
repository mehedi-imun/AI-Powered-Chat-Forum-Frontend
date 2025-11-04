export const PUBLIC_ROUTES = {
  HOME: "/",
  THREADS: "/threads",
  THREAD_DETAIL: (slug: string) => `/threads/${slug}`,
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const;

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  THREADS: "/dashboard/threads",
  THREAD_CREATE: "/dashboard/threads/create",
  THREAD_DETAIL: (id: string) => `/dashboard/threads/${id}`,
  THREAD_EDIT: (id: string) => `/dashboard/threads/${id}/edit`,
  PROFILE: "/dashboard/profile",
  PROFILE_EDIT: "/dashboard/profile/edit",
  NOTIFICATIONS: "/dashboard/notifications",
  SETTINGS: "/dashboard/settings",
} as const;
