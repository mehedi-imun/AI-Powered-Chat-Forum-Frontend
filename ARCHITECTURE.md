# Frontend Architecture Documentation

## 📁 Folder Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── dashboard/                # User dashboard
│   │   ├── profile/
│   │   ├── settings/
│   │   └── notifications/
│   ├── admin/                    # Admin routes
│   ├── threads/                  # Thread pages
│   └── actions/                  # Server Actions
│       ├── auth.actions.ts
│       ├── user.actions.ts
│       ├── thread.actions.ts
│       └── notification.actions.ts
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── stat-card.tsx         # Statistics card component
│   │   ├── loading.tsx           # Loading spinners
│   │   ├── alert-message.tsx     # Alert components
│   │   ├── form-fields.tsx       # Form field components
│   │   └── ...shadcn components
│   ├── shared/                   # Shared feature components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── admin-header.tsx
│   │   └── admin-sidebar.tsx
│   ├── threads/                  # Thread-specific components
│   └── forms/                    # Form components
├── lib/                          # Core libraries and utilities
│   ├── api/                      # API client and services
│   │   └── client.ts             # API client configuration
│   ├── types/                    # TypeScript type definitions
│   │   └── api.types.ts          # API response types
│   ├── utils/                    # Utility functions
│   │   ├── format.ts             # Format utilities (date, number, text)
│   │   ├── validation.ts         # Validation utilities
│   │   └── index.ts              # Utilities export
│   ├── constants/                # Application constants
│   │   └── index.ts              # Routes, roles, messages, etc.
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-app-selector.ts
│   │   └── use-app-dispatch.ts
│   ├── redux/                    # Redux store
│   │   ├── store.ts
│   │   └── slices/
│   └── schemas/                  # Validation schemas
└── public/                       # Static assets

```

## 🎨 Design Principles

### 1. **DRY (Don't Repeat Yourself)**

- Reusable components in `components/ui/`
- Shared utilities in `lib/utils/`
- Centralized constants in `lib/constants/`
- Common types in `lib/types/`

### 2. **Separation of Concerns**

- **Presentation**: Components focus on UI
- **Business Logic**: Server actions handle API calls
- **State Management**: Redux for global state
- **Utilities**: Pure functions for common operations

### 3. **Type Safety**

- Comprehensive TypeScript types in `lib/types/`
- Strict type checking enabled
- Proper interfaces for all API responses

### 4. **Scalability**

- Feature-based organization
- Easy to add new features without restructuring
- Clear dependencies and imports

## 📦 Key Components

### UI Components (`components/ui/`)

#### StatCard

```tsx
import { StatCard } from "@/components/ui/stat-card";

<StatCard
  title="Total Posts"
  value={42}
  description="Comments made"
  icon={MessageCircle}
  bgColor="bg-blue-100"
  iconColor="text-blue-600"
  trend={{ value: 12, isPositive: true }}
/>;
```

#### PageHeader

```tsx
import { PageHeader } from "@/components/ui/stat-card";

<PageHeader
  title="Dashboard"
  description="Manage your account"
  actions={<Button>Action</Button>}
/>;
```

#### LoadingSpinner

```tsx
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

<LoadingSpinner size="md" text="Loading..." />
<PageLoader text="Loading page..." />
```

#### AlertMessage

```tsx
import { AlertMessage } from "@/components/ui/alert-message";

<AlertMessage type="success" message="Profile updated!" />
<AlertMessage type="error" message="Something went wrong" />
```

#### Form Fields

```tsx
import { TextField, TextAreaField } from "@/components/ui/form-fields";

<TextField
  label="Name"
  id="name"
  name="name"
  value={name}
  onChange={setName}
  required
  minLength={2}
  maxLength={50}
/>

<TextAreaField
  label="Bio"
  id="bio"
  name="bio"
  value={bio}
  onChange={setBio}
  maxLength={500}
  showCharCount
/>
```

## 🛠️ Utilities

### Format Utils (`lib/utils/format.ts`)

```tsx
import {
  formatRelativeTime,
  formatDate,
  formatNumber,
  formatCompactNumber,
  truncateText,
  getInitials,
} from "@/lib/utils/format";

// Date formatting
formatRelativeTime(new Date()); // "2 hours ago"
formatDate(new Date(), "short"); // "Dec 5, 2025"

// Number formatting
formatNumber(1000); // "1,000"
formatCompactNumber(1500); // "1.5K"

// Text utilities
truncateText("Long text...", 20); // "Long text..."
getInitials("John Doe"); // "JD"
```

### Validation Utils (`lib/utils/validation.ts`)

```tsx
import {
  isValidEmail,
  validatePassword,
  validateRequired,
  validateForm,
} from "@/lib/utils/validation";

// Email validation
isValidEmail("user@example.com"); // true

// Password validation
const result = validatePassword("weak");
// { isValid: false, errors: ["Password must be at least 6 characters"] }

// Form validation
const errors = validateForm(values, {
  email: [(v) => validateRequired(v, "Email")],
  password: [(v) => validateRequired(v, "Password")],
});
```

## 📐 Constants (`lib/constants/`)

```tsx
import { ROUTES, USER_ROLES, MESSAGES, VALIDATION } from "@/lib/constants";

// Routes
<Link href={ROUTES.DASHBOARD}>Dashboard</Link>
<Link href={ROUTES.DASHBOARD_PROFILE}>Profile</Link>

// Role checking
if (user.role === USER_ROLES.ADMIN) { ... }

// Messages
toast.success(MESSAGES.LOGIN_SUCCESS);
toast.error(MESSAGES.NETWORK_ERROR);

// Validation rules
<Input minLength={VALIDATION.PASSWORD_MIN_LENGTH} />
```

## 🔧 API Client (`lib/api/client.ts`)

```tsx
import { apiFetch, buildQueryString, getAuthHeader } from "@/lib/api/client";

// Make API calls
const data = await apiFetch("/users/me", {
  headers: getAuthHeader(token),
});

// Build query strings
const qs = buildQueryString({ page: 1, limit: 20 });
// ?page=1&limit=20
```

## 📝 Type Definitions (`lib/types/api.types.ts`)

```tsx
import type {
  User,
  UserStats,
  Thread,
  Post,
  Notification,
  ApiResponse,
  ActionResponse,
} from "@/lib/types/api.types";

// Use in components
const [user, setUser] = useState<User | null>(null);
const [stats, setStats] = useState<UserStats>({ ... });
```

## 🚀 Best Practices

### 1. **Component Organization**

- Keep components small and focused
- Extract reusable UI patterns to `components/ui/`
- Use feature folders for complex features

### 2. **Import Organization**

```tsx
// 1. React/Next imports
import { useState, useEffect } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { toast } from "sonner";

// 3. UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Custom components
import { StatCard } from "@/components/ui/stat-card";

// 5. Utils and types
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/types/api.types";

// 6. Constants
import { ROUTES } from "@/lib/constants";
```

### 3. **Server Actions**

- Always in `app/actions/` directory
- Use `"use server"` directive
- Return consistent response format
- Handle errors gracefully

### 4. **Error Handling**

```tsx
try {
  const result = await someAction();
  if (result.success) {
    // Handle success
  } else {
    // Handle error with result.error
  }
} catch (error) {
  // Handle network errors
}
```

### 5. **Loading States**

```tsx
if (loading) {
  return <PageLoader text="Loading..." />;
}
```

## 🎯 Code Examples

### Complete Page Example

```tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading";
import { AlertMessage } from "@/components/ui/alert-message";
import { Card } from "@/components/ui/card";
import { getSomeDataAction } from "@/app/actions/data.actions";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { SomeData } from "@/lib/types/api.types";

export default function ExamplePage() {
  const [data, setData] = useState<SomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getSomeDataAction();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Example Page" description="This is an example" />

      {error && <AlertMessage type="error" message={error} />}

      <Card>{/* Content */}</Card>
    </div>
  );
}
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Hooks](https://react.dev/reference/react)

## 🔄 Migration Guide

When updating old components:

1. **Replace inline stats** with `<StatCard />`
2. **Replace loading divs** with `<PageLoader />` or `<LoadingSpinner />`
3. **Replace alert divs** with `<AlertMessage />`
4. **Replace form fields** with `<TextField />` or `<TextAreaField />`
5. **Import from constants** instead of hardcoding values
6. **Use format utilities** for dates and numbers
7. **Add proper TypeScript types** from `lib/types/`

## 🎉 Summary

This architecture provides:

- ✅ **Clean code** with clear separation of concerns
- ✅ **Reusable components** reducing duplication
- ✅ **Type safety** with comprehensive TypeScript types
- ✅ **Scalability** with feature-based organization
- ✅ **Maintainability** with consistent patterns
- ✅ **Developer experience** with utilities and constants
