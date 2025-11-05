export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Chat Forum",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  thread: {
    titleMinLength: 5,
    titleMaxLength: 200,
    contentMinLength: 20,
    contentMaxLength: 10000,
  },
} as const;
