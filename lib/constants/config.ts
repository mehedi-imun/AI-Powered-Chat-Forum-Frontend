export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME,
  url: process.env.NEXT_PUBLIC_APP_URL,
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
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
