# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server (port 3000)
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Architecture

### Rendering Strategy
This is a **mixed** Next.js 15 App Router app. Most data-fetching pages use **Server Components** with **Next.js Server Actions** (`"use server"` in `app/actions/`). Client-side real-time features (Socket.IO, Redux UI state) use `"use client"` components.

Server Actions in `app/actions/` read the `accessToken` cookie directly via `next/headers cookies()` — they do not go through the Redux store. This means auth token handling differs between server and client code:
- **Server Actions** → read `accessToken` from cookie via `cookies()`
- **Client Components** → read `accessToken` from Redux `auth` slice

### Providers (Root Layout)
`app/layout.tsx` wraps the entire app in two providers in order:
1. `ReduxProvider` — sets up Redux store with `redux-persist` (only `auth` slice is persisted to localStorage)
2. `SocketProvider` — connects Socket.IO when `isAuthenticated && accessToken` are truthy; disconnects on logout

### Socket.IO (`components/providers/socket-provider.tsx`)
Connects to `NEXT_PUBLIC_SOCKET_URL` using the JWT `accessToken` from Redux as `auth.token`. Exposes `useSocket()` hook returning `{ socket, isConnected, connect, disconnect, getSocket }`. Socket reconnects automatically (infinite retries, 5s max delay). Use `socketRef` + `setSocket` pattern — state updates are deferred via `setTimeout` to avoid React batching issues.

### Redux Store (`lib/redux/`)
Three slices:
- `authSlice` — `{ user, accessToken, isAuthenticated }`. Persisted. Actions: `setCredentials`, `logout`, `updateUser`.
- `notificationSlice` — unread count + notification list. Not persisted.
- `uiSlice` — loading states, modal open/close. Not persisted.

Only `auth` is in `persistConfig.whitelist`. Access store with typed hooks from `lib/hooks/`.

### API Client (`lib/api/client.ts`)
`apiFetch<T>(endpoint, options)` is a thin `fetch` wrapper that prepends `NEXT_PUBLIC_API_URL`, sets `Content-Type: application/json`, and throws `ApiError` on non-2xx. Use `getAuthHeader(token)` to build the `Authorization: Bearer` header. Use `buildQueryString(params)` to build URL query strings — it skips `undefined`/`null`/empty values.

**There is no automatic token refresh interceptor.** On 401 errors the app currently throws an `ApiError`. If adding an interceptor, it belongs in `apiFetch`.

### Route Structure
```
app/
├── (auth)/          → Auth route group — shares no layout with the main app
│   ├── login/
│   ├── register/
│   └── verify-email/
├── dashboard/       → Post-login home
├── threads/
│   ├── page.tsx     → Thread list (Server Component)
│   └── [id]/        → Thread detail with real-time posts
├── admin/           → Admin panel — has its own layout.tsx with sidebar + role guard
│   ├── users/
│   ├── posts/
│   ├── threads/
│   ├── reports/
│   ├── moderation/  → AI moderation queue
│   ├── analytics/
│   └── notifications/
└── actions/         → All Server Actions (one file per domain)
    ├── auth.actions.ts
    ├── thread.actions.ts
    ├── post.actions.ts
    ├── user.actions.ts
    ├── notification.actions.ts
    └── admin.actions.ts
```

### Component Organization
```
components/
├── ui/          → shadcn/ui primitives (Button, Dialog, Select, etc.) — do not modify directly
├── shared/      → Reused across multiple pages
├── forms/       → Form components using React Hook Form + Zod resolvers
├── threads/     → Thread-specific display components
├── tables/      → TanStack Table v8 wrappers for admin data tables
├── landing/     → Landing page sections
└── providers/   → Context providers (Redux, Socket)
```

### Forms
Use **React Hook Form** + **Zod** for all forms. Zod schemas live in `lib/schemas/`. Resolvers wired via `@hookform/resolvers/zod`. Validation errors display inline via `form.formState.errors`.

### Styling
Tailwind CSS 4. Use `cn()` from `lib/utils.ts` (combines `clsx` + `tailwind-merge`) for conditional class names. `next-themes` is installed for dark mode — a theme toggle component needs to be wired up; `ThemeProvider` is not yet added to root layout.

### Path Alias
`@/` maps to the repo root. Use `@/components/...`, `@/lib/...`, `@/app/...` everywhere — never use relative `../` imports that cross major directory boundaries.

### TypeScript
`strict: true`. Frontend types in `lib/types/` and `app/types/`. `lib/types/index.ts` re-exports from `./user`, `./thread`, `./api`. Do not duplicate type definitions between `lib/types/` and `app/types/`.
