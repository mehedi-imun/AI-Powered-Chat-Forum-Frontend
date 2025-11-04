# Frontend Implementation Plan - Next.js 16 Chat Forum

## Technology Stack (Final)

### Core Framework

- **Next.js 16** - App Router, React 19, TypeScript
- **React 19** - Server Components, Server Actions
- **TypeScript** - Strict mode

### UI & Styling

- **ShadcnUI** - Component library (Radix UI based)
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **CVA** - Class Variance Authority

### State & Data Fetching

- **Server Actions** - Primary data layer (replaces RTK/Axios)
- **Redux Toolkit** - Client state only (auth, UI)
- **Redux Persist** - Persist auth state

### Forms & Validation

- **React Hook Form** - Uncontrolled forms
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod + RHF integration

### Real-time

- **Socket.IO Client** - Real-time updates only

### Tables

- **TanStack Table** - Headless table library
- **ShadcnUI Table** - UI components

### SEO & Meta

- **next-seo** - SEO helpers
- **Dynamic Sitemap** - Auto-generated
- **Open Graph** - Social sharing

---

## Architecture Decision

```
┌─────────────────────────────────────────────────┐
│            Next.js App Router                   │
├─────────────────────────────────────────────────┤
│  Server Components (SSR)                        │
│  └── Direct Backend API calls                   │
│                                                  │
│  Server Actions (Mutations)                     │
│  └── Create, Update, Delete operations          │
│  └── Form handling + Revalidation               │
│                                                  │
│  Client Components                              │
│  ├── Redux (auth + UI state only)               │
│  └── Socket.IO (real-time updates only)         │
└─────────────────────────────────────────────────┘
```

### Why This Approach?

| Technology            | Purpose              | Why                                      |
| --------------------- | -------------------- | ---------------------------------------- |
| **Server Actions**    | All data mutations   | Native Next.js, type-safe, no client API |
| **Server Components** | Initial data loading | SSR, SEO-friendly, fast                  |
| **Redux**             | Auth + UI state      | Persist user, theme, sidebar state       |
| **Socket.IO**         | Real-time only       | Live posts, notifications                |
| **No Axios/RTK**      | -                    | Server Actions handles everything        |

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                  # Landing page (navbar + hero + footer)
│   │
│   ├── (auth)/                   # Auth pages (no SEO)
│   │   ├── layout.tsx           # Centered card layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/              # Protected dashboard (no SEO)
│   │   ├── layout.tsx           # Dashboard layout (sidebar + header)
│   │   ├── page.tsx             # Dashboard home
│   │   ├── threads/
│   │   │   ├── page.tsx         # All threads list
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── actions/                  # Server Actions (replaces RTK/Axios)
│   │   ├── auth.actions.ts
│   │   ├── user.actions.ts
│   │   ├── thread.actions.ts
│   │   └── notification.actions.ts
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── forms/                    # Reusable form components
│   │   ├── form-wrapper.tsx
│   │   ├── form-input.tsx
│   │   ├── form-textarea.tsx
│   │   ├── form-select.tsx
│   │   └── form-checkbox.tsx
│   │
│   ├── tables/                   # Reusable table components
│   │   ├── data-table.tsx
│   │   ├── data-table-toolbar.tsx
│   │   ├── data-table-pagination.tsx
│   │   └── columns/
│   │       └── thread-columns.tsx
│   │
│   ├── landing/                  # Landing page components
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   └── footer.tsx
│   │
│   ├── shared/                   # Shared components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── error-message.tsx
│   │   └── thread-card.tsx
│   │
│   ├── providers/                # Context providers
│   │   ├── redux-provider.tsx
│   │   ├── socket-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   └── ui/                       # ShadcnUI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── table.tsx
│       └── ...
│
├── lib/
│   ├── redux/                    # Redux store (UI state only)
│   │   ├── store.ts
│   │   ├── rootReducer.ts
│   │   └── slices/
│   │       ├── authSlice.ts     # Auth state
│   │       ├── uiSlice.ts       # Sidebar, theme
│   │       └── notificationSlice.ts
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-socket.ts
│   │   ├── use-app-dispatch.ts
│   │   ├── use-app-selector.ts
│   │   └── use-table.ts
│   │
│   ├── schemas/                  # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   └── thread.schema.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                # Class merger
│   │   ├── format-date.ts
│   │   └── api-client.ts        # Fetch wrapper for Server Actions
│   │
│   └── constants/                # Constants
│       ├── routes.ts
│       └── config.ts
│
├── types/
│   ├── user.ts
│   ├── thread.ts
│   └── api.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json              # ShadcnUI config
└── package.json
```

---

## Implementation Phases (Git-based)

### **Phase 1: Project Setup** (Days 1-2)

**Branch**: `chore/project-setup`

#### Tasks:

1. **Initialize Next.js Project**

   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
   cd frontend
   ```

   - Commit: `chore: initialize Next.js 16 project`

2. **Install Core Dependencies**

   ```bash
   npm install @reduxjs/toolkit react-redux redux-persist
   npm install socket.io-client
   npm install zod react-hook-form @hookform/resolvers
   npm install lucide-react class-variance-authority clsx tailwind-merge
   npm install @tanstack/react-table
   npm install next-seo
   ```

   - Commit: `chore: install core dependencies`

3. **Setup ShadcnUI**

   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button input label card form table select textarea checkbox
   npx shadcn@latest add dropdown-menu dialog alert-dialog toast
   ```

   - Commit: `chore: setup ShadcnUI components`

4. **Configure Tailwind**

   - File: `tailwind.config.ts`
   - Add custom colors, fonts
   - Commit: `chore: configure Tailwind CSS`

5. **Utility Functions**

   - File: `lib/utils/cn.ts`

   ```typescript
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

   - Commit: `feat: add utility functions`

6. **Environment Configuration**

   - File: `.env.local`

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Chat Forum
   API_URL=http://localhost:5000/api/v1
   ```

   - Commit: `chore: add environment configuration`

7. **API Client for Server Actions**

   - File: `lib/utils/api-client.ts`

   ```typescript
   import { cookies } from "next/headers";

   export async function apiClient<T>(
     endpoint: string,
     options?: RequestInit
   ): Promise<T> {
     const token = cookies().get("accessToken")?.value;

     const response = await fetch(`${process.env.API_URL}${endpoint}`, {
       ...options,
       headers: {
         "Content-Type": "application/json",
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options?.headers,
       },
     });

     if (!response.ok) {
       throw new Error(`API Error: ${response.statusText}`);
     }

     return response.json();
   }
   ```

   - Commit: `feat: add API client for Server Actions`

8. **SEO Configuration**

   - File: `next-seo.config.ts`

   ```typescript
   import { DefaultSeoProps } from "next-seo";

   export const defaultSEO: DefaultSeoProps = {
     titleTemplate: "%s | Chat Forum",
     defaultTitle: "Chat Forum - Community Discussions",
     description: "Join the conversation in our AI-powered chat forum",
     openGraph: {
       type: "website",
       locale: "en_US",
       url: process.env.NEXT_PUBLIC_SITE_URL,
       siteName: "Chat Forum",
     },
     twitter: {
       cardType: "summary_large_image",
     },
   };
   ```

   - File: `app/sitemap.ts` - Dynamic sitemap
   - File: `app/robots.ts` - Robots.txt
   - Commit: `feat: add SEO configuration`

**Acceptance Criteria:**

- ✅ Next.js dev server runs (`npm run dev`)
- ✅ Tailwind CSS working
- ✅ ShadcnUI components installed
- ✅ Environment variables loaded

**PR**: `[Chore] Project Setup - Next.js 16 + ShadcnUI + Dependencies`

---

### **Phase 2: Redux Store Setup** (Days 3-4)

**Branch**: `feat/redux-store`

#### Tasks:

1. **Auth Redux Slice**

   - File: `lib/redux/slices/authSlice.ts`

   ```typescript
   import { createSlice, PayloadAction } from "@reduxjs/toolkit";

   interface User {
     id: string;
     name: string;
     email: string;
     role: string;
     avatar?: string;
   }

   interface AuthState {
     user: User | null;
     accessToken: string | null;
     isAuthenticated: boolean;
   }

   const initialState: AuthState = {
     user: null,
     accessToken: null,
     isAuthenticated: false,
   };

   const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
       setCredentials: (
         state,
         action: PayloadAction<{ user: User; accessToken: string }>
       ) => {
         state.user = action.payload.user;
         state.accessToken = action.payload.accessToken;
         state.isAuthenticated = true;
       },
       logout: (state) => {
         state.user = null;
         state.accessToken = null;
         state.isAuthenticated = false;
       },
       updateUser: (state, action: PayloadAction<Partial<User>>) => {
         if (state.user) {
           state.user = { ...state.user, ...action.payload };
         }
       },
     },
   });

   export const { setCredentials, logout, updateUser } = authSlice.actions;
   export default authSlice.reducer;
   ```

   - Commit: `feat: add auth Redux slice`

2. **UI Redux Slice**

   - File: `lib/redux/slices/uiSlice.ts`

   ```typescript
   import { createSlice } from "@reduxjs/toolkit";

   interface UIState {
     sidebarOpen: boolean;
     theme: "light" | "dark";
   }

   const initialState: UIState = {
     sidebarOpen: true,
     theme: "light",
   };

   const uiSlice = createSlice({
     name: "ui",
     initialState,
     reducers: {
       toggleSidebar: (state) => {
         state.sidebarOpen = !state.sidebarOpen;
       },
       setTheme: (state, action) => {
         state.theme = action.payload;
       },
     },
   });

   export const { toggleSidebar, setTheme } = uiSlice.actions;
   export default uiSlice.reducer;
   ```

   - Commit: `feat: add UI Redux slice`

3. **Notification Redux Slice**

   - File: `lib/redux/slices/notificationSlice.ts`

   ```typescript
   import { createSlice, PayloadAction } from "@reduxjs/toolkit";

   interface NotificationState {
     unreadCount: number;
   }

   const initialState: NotificationState = {
     unreadCount: 0,
   };

   const notificationSlice = createSlice({
     name: "notification",
     initialState,
     reducers: {
       setUnreadCount: (state, action: PayloadAction<number>) => {
         state.unreadCount = action.payload;
       },
       incrementUnread: (state) => {
         state.unreadCount += 1;
       },
       decrementUnread: (state) => {
         state.unreadCount = Math.max(0, state.unreadCount - 1);
       },
     },
   });

   export const { setUnreadCount, incrementUnread, decrementUnread } =
     notificationSlice.actions;
   export default notificationSlice.reducer;
   ```

   - Commit: `feat: add notification Redux slice`

4. **Root Reducer**

   - File: `lib/redux/rootReducer.ts`

   ```typescript
   import { combineReducers } from "@reduxjs/toolkit";
   import authReducer from "./slices/authSlice";
   import uiReducer from "./slices/uiSlice";
   import notificationReducer from "./slices/notificationSlice";

   export const rootReducer = combineReducers({
     auth: authReducer,
     ui: uiReducer,
     notification: notificationReducer,
   });
   ```

   - Commit: `feat: add root reducer`

5. **Redux Store Configuration**

   - File: `lib/redux/store.ts`

   ```typescript
   import { configureStore } from "@reduxjs/toolkit";
   import { persistStore, persistReducer } from "redux-persist";
   import storage from "redux-persist/lib/storage";
   import { rootReducer } from "./rootReducer";

   const persistConfig = {
     key: "root",
     storage,
     whitelist: ["auth"],
   };

   const persistedReducer = persistReducer(persistConfig, rootReducer);

   export const store = configureStore({
     reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware({
         serializableCheck: {
           ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
         },
       }),
   });

   export const persistor = persistStore(store);
   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   ```

   - Commit: `feat: configure Redux store with persistence`

6. **Redux Provider**

   - File: `components/providers/redux-provider.tsx`

   ```typescript
   "use client";

   import { Provider } from "react-redux";
   import { PersistGate } from "redux-persist/integration/react";
   import { store, persistor } from "@/lib/redux/store";

   export function ReduxProvider({ children }: { children: React.ReactNode }) {
     return (
       <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
           {children}
         </PersistGate>
       </Provider>
     );
   }
   ```

   - Commit: `feat: add Redux provider`

7. **Custom Redux Hooks**

   - File: `lib/hooks/use-app-dispatch.ts`

   ```typescript
   import { useDispatch } from "react-redux";
   import type { AppDispatch } from "@/lib/redux/store";

   export const useAppDispatch = () => useDispatch<AppDispatch>();
   ```

   - File: `lib/hooks/use-app-selector.ts`

   ```typescript
   import { useSelector } from "react-redux";
   import type { RootState } from "@/lib/redux/store";

   export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
     return useSelector(selector);
   };
   ```

   - Commit: `feat: add typed Redux hooks`

8. **Update Root Layout**

   - File: `app/layout.tsx`

   ```typescript
   import { ReduxProvider } from "@/components/providers/redux-provider";
   import "./globals.css";

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body>
           <ReduxProvider>{children}</ReduxProvider>
         </body>
       </html>
     );
   }
   ```

   - Commit: `feat: integrate Redux provider in root layout`

**Acceptance Criteria:**

- ✅ Redux store configured
- ✅ Auth state persisted
- ✅ Typed hooks working
- ✅ No TypeScript errors

**PR**: `[Feat] Redux Store Setup - Auth, UI, Notification Slices`

---

### **Phase 3: Server Actions (Auth)** (Days 5-6)

**Branch**: `feat/server-actions-auth`

#### Tasks:

1. **Auth Server Actions**

   - File: `app/actions/auth.actions.ts`

   ```typescript
   "use server";

   import { cookies } from "next/headers";
   import { redirect } from "next/navigation";
   import { apiClient } from "@/lib/utils/api-client";

   export async function loginAction(formData: FormData) {
     const email = formData.get("email") as string;
     const password = formData.get("password") as string;

     try {
       const response = await apiClient<{
         success: boolean;
         data: { user: any; accessToken: string; refreshToken: string };
       }>("/auth/login", {
         method: "POST",
         body: JSON.stringify({ email, password }),
       });

       cookies().set("accessToken", response.data.accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 15,
       });

       cookies().set("refreshToken", response.data.refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 60 * 24 * 7,
       });

       return {
         success: true,
         user: response.data.user,
         token: response.data.accessToken,
       };
     } catch (error) {
       return { success: false, error: "Invalid credentials" };
     }
   }

   export async function registerAction(formData: FormData) {
     const name = formData.get("name") as string;
     const email = formData.get("email") as string;
     const password = formData.get("password") as string;

     try {
       const response = await apiClient<{ success: boolean; data: any }>(
         "/auth/register",
         {
           method: "POST",
           body: JSON.stringify({ name, email, password }),
         }
       );

       return { success: true, data: response.data };
     } catch (error) {
       return { success: false, error: "Registration failed" };
     }
   }

   export async function logoutAction() {
     try {
       await apiClient("/auth/logout", { method: "POST" });
     } catch (error) {
       console.error("Logout error:", error);
     } finally {
       cookies().delete("accessToken");
       cookies().delete("refreshToken");
       redirect("/login");
     }
   }

   export async function getCurrentUser() {
     try {
       const response = await apiClient<{ success: boolean; data: any }>(
         "/users/me"
       );
       return response.data;
     } catch (error) {
       return null;
     }
   }
   ```

   - Commit: `feat: add auth Server Actions`

2. **Auth Schemas**

   - File: `lib/schemas/auth.schema.ts`

   ```typescript
   import { z } from "zod";

   export const loginSchema = z.object({
     email: z.string().email("Invalid email address"),
     password: z.string().min(6, "Password must be at least 6 characters"),
   });

   export const registerSchema = z
     .object({
       name: z.string().min(2, "Name must be at least 2 characters"),
       email: z.string().email("Invalid email address"),
       password: z.string().min(6, "Password must be at least 6 characters"),
       confirmPassword: z.string(),
     })
     .refine((data) => data.password === data.confirmPassword, {
       message: "Passwords do not match",
       path: ["confirmPassword"],
     });

   export type LoginFormData = z.infer<typeof loginSchema>;
   export type RegisterFormData = z.infer<typeof registerSchema>;
   ```

   - Commit: `feat: add auth Zod schemas`

3. **useAuth Hook**

   - File: `lib/hooks/use-auth.ts`

   ```typescript
   "use client";

   import { useAppSelector } from "./use-app-selector";
   import { useAppDispatch } from "./use-app-dispatch";
   import { logout as logoutAction } from "@/lib/redux/slices/authSlice";
   import { logoutAction as serverLogout } from "@/app/actions/auth.actions";

   export const useAuth = () => {
     const dispatch = useAppDispatch();
     const { user, isAuthenticated } = useAppSelector((state) => state.auth);

     const logout = async () => {
       await serverLogout();
       dispatch(logoutAction());
     };

     return { user, isAuthenticated, logout };
   };
   ```

   - Commit: `feat: add useAuth hook`

**Acceptance Criteria:**

- ✅ Server Actions created
- ✅ Cookies set correctly
- ✅ Type-safe with Zod
- ✅ useAuth hook working

**PR**: `[Feat] Server Actions - Authentication`

---

### **Phase 4: Reusable Form System** (Days 7-8)

**Branch**: `feat/reusable-forms`

#### Tasks:

1. **Form Wrapper Component**

   - File: `components/forms/form-wrapper.tsx`

   ```typescript
   "use client";

   import { ReactNode } from "react";
   import { FormProvider, UseFormReturn } from "react-hook-form";

   interface FormWrapperProps<T extends Record<string, any>> {
     form: UseFormReturn<T>;
     onSubmit: (data: T) => void | Promise<void>;
     children: ReactNode;
     className?: string;
   }

   export function FormWrapper<T extends Record<string, any>>({
     form,
     onSubmit,
     children,
     className = "",
   }: FormWrapperProps<T>) {
     return (
       <FormProvider {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
           {children}
         </form>
       </FormProvider>
     );
   }
   ```

   - Commit: `feat: add form wrapper component`

2. **Form Input Component**

   - File: `components/forms/form-input.tsx`

   ```typescript
   "use client";

   import { useFormContext } from "react-hook-form";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";

   interface FormInputProps {
     name: string;
     label: string;
     type?: string;
     placeholder?: string;
     required?: boolean;
   }

   export function FormInput({
     name,
     label,
     type = "text",
     placeholder,
     required,
   }: FormInputProps) {
     const {
       register,
       formState: { errors },
     } = useFormContext();
     const error = errors[name]?.message as string | undefined;

     return (
       <div className="space-y-2">
         <Label htmlFor={name}>
           {label} {required && <span className="text-red-500">*</span>}
         </Label>
         <Input
           id={name}
           type={type}
           placeholder={placeholder}
           {...register(name)}
           className={error ? "border-red-500" : ""}
         />
         {error && <p className="text-sm text-red-500">{error}</p>}
       </div>
     );
   }
   ```

   - Commit: `feat: add form input component`

3. **Form Textarea Component**

   - File: `components/forms/form-textarea.tsx`

   ```typescript
   "use client";

   import { useFormContext } from "react-hook-form";
   import { Textarea } from "@/components/ui/textarea";
   import { Label } from "@/components/ui/label";

   interface FormTextareaProps {
     name: string;
     label: string;
     placeholder?: string;
     rows?: number;
     required?: boolean;
   }

   export function FormTextarea({
     name,
     label,
     placeholder,
     rows = 4,
     required,
   }: FormTextareaProps) {
     const {
       register,
       formState: { errors },
     } = useFormContext();
     const error = errors[name]?.message as string | undefined;

     return (
       <div className="space-y-2">
         <Label htmlFor={name}>
           {label} {required && <span className="text-red-500">*</span>}
         </Label>
         <Textarea
           id={name}
           placeholder={placeholder}
           rows={rows}
           {...register(name)}
           className={error ? "border-red-500" : ""}
         />
         {error && <p className="text-sm text-red-500">{error}</p>}
       </div>
     );
   }
   ```

   - Commit: `feat: add form textarea component`

4. **Form Select Component**

   - File: `components/forms/form-select.tsx`
   - Commit: `feat: add form select component`

5. **Form Checkbox Component**
   - File: `components/forms/form-checkbox.tsx`
   - Commit: `feat: add form checkbox component`

**Acceptance Criteria:**

- ✅ All form components reusable
- ✅ Error handling working
- ✅ TypeScript typed
- ✅ Accessible

**PR**: `[Feat] Reusable Form System - Input, Textarea, Select, Checkbox`

---

### **Phase 5: Auth Pages** (Days 9-10)

**Branch**: `feat/auth-pages`

#### Tasks:

1. **Auth Layout**

   - File: `app/(auth)/layout.tsx`

   ```typescript
   export const metadata = {
     robots: "noindex, nofollow",
   };

   export default function AuthLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="w-full max-w-md p-8">{children}</div>
       </div>
     );
   }
   ```

   - Commit: `feat: add auth layout`

2. **Login Page**

   - File: `app/(auth)/login/page.tsx`

   ```typescript
   "use client";

   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { useRouter } from "next/navigation";
   import { loginAction } from "@/app/actions/auth.actions";
   import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
   import { setCredentials } from "@/lib/redux/slices/authSlice";
   import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
   import { FormWrapper } from "@/components/forms/form-wrapper";
   import { FormInput } from "@/components/forms/form-input";
   import { Button } from "@/components/ui/button";
   import {
     Card,
     CardHeader,
     CardTitle,
     CardContent,
   } from "@/components/ui/card";

   export default function LoginPage() {
     const router = useRouter();
     const dispatch = useAppDispatch();

     const form = useForm<LoginFormData>({
       resolver: zodResolver(loginSchema),
     });

     const onSubmit = async (data: LoginFormData) => {
       const formData = new FormData();
       formData.append("email", data.email);
       formData.append("password", data.password);

       const result = await loginAction(formData);

       if (result.success) {
         dispatch(
           setCredentials({ user: result.user, accessToken: result.token })
         );
         router.push("/dashboard");
       } else {
         form.setError("root", { message: result.error });
       }
     };

     return (
       <Card>
         <CardHeader>
           <CardTitle>Login</CardTitle>
         </CardHeader>
         <CardContent>
           <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
             <FormInput name="email" label="Email" type="email" required />
             <FormInput
               name="password"
               label="Password"
               type="password"
               required
             />

             {form.formState.errors.root && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.root.message}
               </p>
             )}

             <Button
               type="submit"
               className="w-full"
               disabled={form.formState.isSubmitting}
             >
               {form.formState.isSubmitting ? "Logging in..." : "Login"}
             </Button>
           </FormWrapper>
         </CardContent>
       </Card>
     );
   }
   ```

   - Commit: `feat: add login page`

3. **Register Page**

   - File: `app/(auth)/register/page.tsx`
   - Similar structure with registerAction
   - Commit: `feat: add register page`

4. **Auth Middleware**

   - File: `middleware.ts`

   ```typescript
   import { NextResponse } from "next/server";
   import type { NextRequest } from "next/server";

   export function middleware(request: NextRequest) {
     const token = request.cookies.get("accessToken");
     const isAuthPage =
       request.nextUrl.pathname.startsWith("/login") ||
       request.nextUrl.pathname.startsWith("/register");
     const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

     if (isDashboard && !token) {
       return NextResponse.redirect(new URL("/login", request.url));
     }

     if (isAuthPage && token) {
       return NextResponse.redirect(new URL("/dashboard", request.url));
     }

     return NextResponse.next();
   }

   export const config = {
     matcher: ["/dashboard/:path*", "/login", "/register"],
   };
   ```

   - Commit: `feat: add auth middleware`

**Acceptance Criteria:**

- ✅ Login/register working
- ✅ Tokens stored in cookies
- ✅ Redux state updated
- ✅ Protected routes working

**PR**: `[Feat] Auth Pages - Login, Register, Middleware`

---

### **Phase 6: Public Pages (SEO)** (Days 11-12)

**Branch**: `feat/public-pages-seo`

#### Tasks:

1. **Public Layout**

   - File: `app/(public)/layout.tsx`

   ```typescript
   import { Metadata } from "next";
   import { PublicHeader } from "@/components/shared/public-header";
   import { PublicFooter } from "@/components/shared/public-footer";

   export const metadata: Metadata = {
     title: "Chat Forum - Community Discussions",
     description: "Join thousands of users in meaningful conversations",
     openGraph: {
       type: "website",
       url: process.env.NEXT_PUBLIC_SITE_URL,
       title: "Chat Forum",
       description: "Community-driven discussion platform",
       images: ["/og-image.jpg"],
     },
   };

   export default function PublicLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <>
         <PublicHeader />
         <main className="min-h-screen">{children}</main>
         <PublicFooter />
       </>
     );
   }
   ```

   - Commit: `feat: add public layout with SEO`

2. **Landing Page**

   - File: `app/(public)/page.tsx`

   ```typescript
   import { Metadata } from "next";
   import Link from "next/link";
   import { Button } from "@/components/ui/button";

   export const metadata: Metadata = {
     title: "Home",
   };

   export default function HomePage() {
     return (
       <div className="container mx-auto px-4 py-16">
         <div className="text-center space-y-6">
           <h1 className="text-5xl font-bold">Welcome to Chat Forum</h1>
           <p className="text-xl text-gray-600">Join the conversation today</p>
           <div className="flex gap-4 justify-center">
             <Button asChild>
               <Link href="/register">Get Started</Link>
             </Button>
             <Button variant="outline" asChild>
               <Link href="/threads">Browse Threads</Link>
             </Button>
           </div>
         </div>
       </div>
     );
   }
   ```

   - Commit: `feat: add SEO-optimized landing page`

3. **Public Thread List (SSR)**

   - File: `app/(public)/threads/page.tsx`

   ```typescript
   import { Metadata } from "next";
   import { apiClient } from "@/lib/utils/api-client";
   import { ThreadCard } from "@/components/shared/thread-card";

   export const metadata: Metadata = {
     title: "Discussions",
     description: "Browse all community discussions",
   };

   async function getThreads() {
     const response = await apiClient<{
       success: boolean;
       data: { threads: any[] };
     }>("/threads", {
       cache: "no-store",
     });
     return response.data.threads;
   }

   export default async function ThreadsPage() {
     const threads = await getThreads();

     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-6">All Discussions</h1>
         <div className="space-y-4">
           {threads.map((thread) => (
             <ThreadCard key={thread.id} thread={thread} />
           ))}
         </div>
       </div>
     );
   }
   ```

   - Commit: `feat: add public threads page with SSR`

4. **Thread Detail Page (Dynamic SEO)**

   - File: `app/(public)/threads/[slug]/page.tsx`

   ```typescript
   import { Metadata } from "next";
   import { apiClient } from "@/lib/utils/api-client";

   export async function generateMetadata({
     params,
   }: {
     params: { slug: string };
   }): Promise<Metadata> {
     const thread = await apiClient<{ data: any }>(`/threads/${params.slug}`);

     return {
       title: thread.data.title,
       description: thread.data.content.slice(0, 160),
       openGraph: {
         title: thread.data.title,
         description: thread.data.content.slice(0, 160),
         type: "article",
       },
     };
   }

   async function getThread(slug: string) {
     const response = await apiClient<{ data: any }>(`/threads/${slug}`, {
       cache: "no-store",
     });
     return response.data;
   }

   export default async function ThreadDetailPage({
     params,
   }: {
     params: { slug: string };
   }) {
     const thread = await getThread(params.slug);

     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-4xl font-bold mb-4">{thread.title}</h1>
         <div className="prose max-w-none">{thread.content}</div>
       </div>
     );
   }
   ```

   - Commit: `feat: add thread detail page with dynamic SEO`

5. **Dynamic Sitemap**

   - File: `app/sitemap.ts`

   ```typescript
   import { MetadataRoute } from "next";

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const response = await fetch(`${process.env.API_URL}/threads`);
     const { data } = await response.json();

     const threadUrls = data.threads.map((thread: any) => ({
       url: `${process.env.NEXT_PUBLIC_SITE_URL}/threads/${thread.slug}`,
       lastModified: new Date(thread.updatedAt),
       changeFrequency: "daily" as const,
       priority: 0.8,
     }));

     return [
       {
         url: process.env.NEXT_PUBLIC_SITE_URL!,
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 1,
       },
       {
         url: `${process.env.NEXT_PUBLIC_SITE_URL}/threads`,
         lastModified: new Date(),
         changeFrequency: "hourly",
         priority: 0.9,
       },
       ...threadUrls,
     ];
   }
   ```

   - Commit: `feat: add dynamic sitemap`

6. **Robots.txt**

   - File: `app/robots.ts`

   ```typescript
   import { MetadataRoute } from "next";

   export default function robots(): MetadataRoute.Robots {
     return {
       rules: {
         userAgent: "*",
         allow: ["/"],
         disallow: ["/dashboard/", "/admin/", "/api/"],
       },
       sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
     };
   }
   ```

   - Commit: `feat: add robots.txt`

**Acceptance Criteria:**

- ✅ Public pages SSR
- ✅ Dynamic metadata working
- ✅ Sitemap generated
- ✅ SEO-friendly

**PR**: `[Feat] Public Pages & SEO - Landing, Threads, Sitemap`

---

### **Phase 7: Dashboard Layout** (Days 13-14)

**Branch**: `feat/dashboard-layout`

#### Tasks:

1. **Dashboard Layout (No SEO)**

   - File: `app/(dashboard)/layout.tsx`

   ```typescript
   import { Metadata } from "next";
   import { Sidebar } from "@/components/shared/sidebar";
   import { Header } from "@/components/shared/header";

   export const metadata: Metadata = {
     robots: "noindex, nofollow",
   };

   export default function DashboardLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="flex h-screen">
         <Sidebar />
         <div className="flex-1 flex flex-col">
           <Header />
           <main className="flex-1 overflow-auto p-6 bg-gray-50">
             {children}
           </main>
         </div>
       </div>
     );
   }
   ```

   - Commit: `feat: add dashboard layout (no SEO)`

2. **Sidebar Component**

   - File: `components/shared/sidebar.tsx`

   ```typescript
   "use client";

   import Link from "next/link";
   import { usePathname } from "next/navigation";
   import { Home, MessageSquare, Bell, User, Settings } from "lucide-react";
   import { cn } from "@/lib/utils/cn";
   import { useAppSelector } from "@/lib/hooks/use-app-selector";

   const navigation = [
     { name: "Dashboard", href: "/dashboard", icon: Home },
     { name: "Threads", href: "/dashboard/threads", icon: MessageSquare },
     { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
     { name: "Profile", href: "/dashboard/profile", icon: User },
     { name: "Settings", href: "/dashboard/settings", icon: Settings },
   ];

   export function Sidebar() {
     const pathname = usePathname();
     const { sidebarOpen } = useAppSelector((state) => state.ui);

     if (!sidebarOpen) return null;

     return (
       <aside className="w-64 bg-white border-r">
         <div className="p-6">
           <h2 className="text-2xl font-bold">Chat Forum</h2>
         </div>
         <nav className="space-y-1 px-3">
           {navigation.map((item) => {
             const Icon = item.icon;
             const isActive = pathname === item.href;

             return (
               <Link
                 key={item.name}
                 href={item.href}
                 className={cn(
                   "flex items-center gap-3 px-3 py-2 rounded-lg",
                   isActive
                     ? "bg-blue-50 text-blue-600"
                     : "text-gray-700 hover:bg-gray-50"
                 )}
               >
                 <Icon className="w-5 h-5" />
                 {item.name}
               </Link>
             );
           })}
         </nav>
       </aside>
     );
   }
   ```

   - Commit: `feat: add sidebar component`

3. **Header Component**

   - File: `components/shared/header.tsx`

   ```typescript
   "use client";

   import { Menu, Bell } from "lucide-react";
   import { Button } from "@/components/ui/button";
   import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
   import { useAppSelector } from "@/lib/hooks/use-app-selector";
   import { toggleSidebar } from "@/lib/redux/slices/uiSlice";
   import { useAuth } from "@/lib/hooks/use-auth";

   export function Header() {
     const dispatch = useAppDispatch();
     const { user } = useAuth();
     const { unreadCount } = useAppSelector((state) => state.notification);

     return (
       <header className="h-16 bg-white border-b flex items-center justify-between px-6">
         <Button
           variant="ghost"
           size="icon"
           onClick={() => dispatch(toggleSidebar())}
         >
           <Menu className="w-5 h-5" />
         </Button>

         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" className="relative">
             <Bell className="w-5 h-5" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                 {unreadCount}
               </span>
             )}
           </Button>

           <div className="flex items-center gap-2">
             <span className="text-sm font-medium">{user?.name}</span>
           </div>
         </div>
       </header>
     );
   }
   ```

   - Commit: `feat: add header component`

4. **Dashboard Home Page**
   - File: `app/(dashboard)/page.tsx`
   - Commit: `feat: add dashboard home page`

**Acceptance Criteria:**

- ✅ Dashboard layout working
- ✅ Sidebar toggle working
- ✅ Header with user info
- ✅ Navigation working

**PR**: `[Feat] Dashboard Layout - Sidebar, Header, Navigation`

---

### **Phase 8: Thread Server Actions** (Days 15-16)

**Branch**: `feat/thread-server-actions`

#### Tasks:

1. **Thread Server Actions**

   - File: `app/actions/thread.actions.ts`

   ```typescript
   "use server";

   import { revalidatePath } from "next/cache";
   import { redirect } from "next/navigation";
   import { apiClient } from "@/lib/utils/api-client";

   export async function createThreadAction(formData: FormData) {
     const title = formData.get("title") as string;
     const content = formData.get("content") as string;
     const tags = formData.get("tags") as string;

     try {
       const response = await apiClient<{ success: boolean; data: any }>(
         "/threads",
         {
           method: "POST",
           body: JSON.stringify({
             title,
             content,
             tags: tags.split(",").map((t) => t.trim()),
           }),
         }
       );

       revalidatePath("/threads");
       revalidatePath("/dashboard/threads");
       redirect(`/threads/${response.data.slug}`);
     } catch (error) {
       return { success: false, error: "Failed to create thread" };
     }
   }

   export async function updateThreadAction(id: string, formData: FormData) {
     const title = formData.get("title") as string;
     const content = formData.get("content") as string;

     try {
       await apiClient(`/threads/${id}`, {
         method: "PATCH",
         body: JSON.stringify({ title, content }),
       });

       revalidatePath(`/threads/${id}`);
       revalidatePath("/dashboard/threads");
       return { success: true };
     } catch (error) {
       return { success: false, error: "Failed to update thread" };
     }
   }

   export async function deleteThreadAction(id: string) {
     try {
       await apiClient(`/threads/${id}`, { method: "DELETE" });
       revalidatePath("/threads");
       revalidatePath("/dashboard/threads");
       redirect("/dashboard/threads");
     } catch (error) {
       return { success: false, error: "Failed to delete thread" };
     }
   }
   ```

   - Commit: `feat: add thread Server Actions`

2. **Thread Schemas**

   - File: `lib/schemas/thread.schema.ts`

   ```typescript
   import { z } from "zod";

   export const threadSchema = z.object({
     title: z.string().min(5, "Title must be at least 5 characters"),
     content: z.string().min(20, "Content must be at least 20 characters"),
     tags: z.string().optional(),
   });

   export type ThreadFormData = z.infer<typeof threadSchema>;
   ```

   - Commit: `feat: add thread Zod schemas`

**Acceptance Criteria:**

- ✅ Thread CRUD actions working
- ✅ Revalidation working
- ✅ Type-safe

**PR**: `[Feat] Thread Server Actions - Create, Update, Delete`

---

### **Phase 9: Socket.IO Integration** (Days 17-18)

**Branch**: `feat/socket-io-integration`

#### Tasks:

1. **Socket Provider**

   - File: `components/providers/socket-provider.tsx`

   ```typescript
   "use client";

   import { createContext, useContext, useEffect, useState } from "react";
   import { io, Socket } from "socket.io-client";
   import { useAppSelector } from "@/lib/hooks/use-app-selector";

   const SocketContext = createContext<Socket | null>(null);

   export function SocketProvider({ children }: { children: React.ReactNode }) {
     const [socket, setSocket] = useState<Socket | null>(null);
     const { accessToken } = useAppSelector((state) => state.auth);

     useEffect(() => {
       if (!accessToken) return;

       const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
         auth: { token: accessToken },
         transports: ["websocket"],
       });

       socketInstance.on("connect", () => {
         console.log("Socket connected");
       });

       socketInstance.on("disconnect", () => {
         console.log("Socket disconnected");
       });

       setSocket(socketInstance);

       return () => {
         socketInstance.disconnect();
       };
     }, [accessToken]);

     return (
       <SocketContext.Provider value={socket}>
         {children}
       </SocketContext.Provider>
     );
   }

   export const useSocket = () => useContext(SocketContext);
   ```

   - Commit: `feat: add Socket.IO provider`

2. **useSocket Hook**

   - File: `lib/hooks/use-socket.ts`

   ```typescript
   import { useContext } from "react";
   import { SocketContext } from "@/components/providers/socket-provider";

   export const useSocket = () => {
     const context = useContext(SocketContext);
     if (!context) {
       throw new Error("useSocket must be used within SocketProvider");
     }
     return context;
   };
   ```

   - Commit: `feat: add useSocket hook`

3. **Real-time Thread Updates**
   - Update thread detail page to listen for new posts
   - Commit: `feat: add real-time thread updates`

**Acceptance Criteria:**

- ✅ Socket.IO connected
- ✅ Real-time updates working
- ✅ Reconnection handling

**PR**: `[Feat] Socket.IO Integration - Real-time Updates`

---

### **Phase 10: Reusable Table System** (Days 19-20)

**Branch**: `feat/reusable-tables`

#### Tasks:

1. **DataTable Component**

   - File: `components/tables/data-table.tsx`

   ```typescript
   "use client";

   import {
     flexRender,
     getCoreRowModel,
     getPaginationRowModel,
     useReactTable,
   } from "@tanstack/react-table";
   import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
   } from "@/components/ui/table";

   interface DataTableProps<TData> {
     columns: any[];
     data: TData[];
   }

   export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
     const table = useReactTable({
       data,
       columns,
       getCoreRowModel: getCoreRowModel(),
       getPaginationRowModel: getPaginationRowModel(),
     });

     return (
       <div className="rounded-md border">
         <Table>
           <TableHeader>
             {table.getHeaderGroups().map((headerGroup) => (
               <TableRow key={headerGroup.id}>
                 {headerGroup.headers.map((header) => (
                   <TableHead key={header.id}>
                     {flexRender(
                       header.column.columnDef.header,
                       header.getContext()
                     )}
                   </TableHead>
                 ))}
               </TableRow>
             ))}
           </TableHeader>
           <TableBody>
             {table.getRowModel().rows.map((row) => (
               <TableRow key={row.id}>
                 {row.getVisibleCells().map((cell) => (
                   <TableCell key={cell.id}>
                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                   </TableCell>
                 ))}
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>
     );
   }
   ```

   - Commit: `feat: add DataTable component`

2. **Thread Columns**
   - File: `components/tables/columns/thread-columns.tsx`
   - Commit: `feat: add thread table columns`

**Acceptance Criteria:**

- ✅ DataTable reusable
- ✅ Pagination working
- ✅ Sorting/filtering ready

**PR**: `[Feat] Reusable Table System - DataTable, Columns`

---

## Timeline Summary

| Phase             | Days  | Description                          |
| ----------------- | ----- | ------------------------------------ |
| 1. Setup          | 1-2   | Project init, dependencies, ShadcnUI |
| 2. Redux          | 3-4   | Redux store, slices, persistence     |
| 3. Auth Actions   | 5-6   | Server Actions for auth              |
| 4. Forms          | 7-8   | Reusable form components             |
| 5. Auth Pages     | 9-10  | Login, register, middleware          |
| 6. Public Pages   | 11-12 | SEO-friendly SSR pages               |
| 7. Dashboard      | 13-14 | Dashboard layout (no SEO)            |
| 8. Thread Actions | 15-16 | Thread Server Actions                |
| 9. Socket.IO      | 17-18 | Real-time integration                |
| 10. Tables        | 19-20 | Reusable table system                |

**Total: ~20 days**

---

## Architecture Principles

### 1. Server Actions (Primary Data Layer)

```typescript
"use server";

export async function createThread(formData: FormData) {
  const response = await fetch(`${process.env.API_URL}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    body: JSON.stringify(data),
  });

  revalidatePath("/threads");
  return response.json();
}
```

### 2. Redux (UI State Only)

```typescript
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});
```

### 3. Socket.IO (Real-time Only)

```typescript
socket?.on("post:created", (post) => {
  router.refresh();
});
```

---

## Clean Code Rules

1. **No Comments** - Code should be self-explanatory
2. **Single Responsibility** - One function, one purpose
3. **DRY** - Don't repeat yourself
4. **Type Safety** - Use TypeScript strictly
5. **Consistent Naming** - camelCase for variables, PascalCase for components

---

## SEO Strategy

### Public Pages (SEO-friendly)

- `/` - Landing page (SSR)
- `/threads` - Thread list (SSR)
- `/threads/[slug]` - Thread detail (SSR + dynamic meta)

### Dashboard Pages (No SEO)

- `/dashboard/*` - All dashboard routes have `robots: noindex`

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Chat Forum
API_URL=http://localhost:5000/api/v1
```

---

## Key Technologies

- **Next.js 16** - Server Actions, App Router
- **ShadcnUI** - Component library
- **Redux Toolkit** - Client state only
- **Socket.IO** - Real-time only
- **No RTK Query** - Server Actions handle all API calls
- **No Axios** - Native fetch with Server Actions
