# Frontend Quick Reference Guide 🚀

## 🎯 Common Tasks

### Creating a New Page

```tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading";
import { AlertMessage } from "@/components/ui/alert-message";
import { ROUTES } from "@/lib/constants";
import type { SomeData } from "@/lib/types/api.types";

export default function NewPage() {
  const [data, setData] = useState<SomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Call your server action here
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Page Title" description="Description" />
      {error && <AlertMessage type="error" message={error} />}
      {/* Your content */}
    </div>
  );
}
```

### Adding a Form

```tsx
import { TextField, TextAreaField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";

const [formData, setFormData] = useState({
  name: "",
  bio: "",
});

<form onSubmit={handleSubmit} className="space-y-4">
  <TextField
    label="Name"
    id="name"
    name="name"
    value={formData.name}
    onChange={(value) => setFormData({ ...formData, name: value })}
    required
    minLength={2}
    maxLength={50}
  />

  <TextAreaField
    label="Bio"
    id="bio"
    name="bio"
    value={formData.bio}
    onChange={(value) => setFormData({ ...formData, bio: value })}
    maxLength={500}
    showCharCount
  />

  <Button type="submit">Submit</Button>
</form>;
```

### Displaying Stats

```tsx
import { StatCard } from "@/components/ui/stat-card";
import { MessageCircle, Bell, Users } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard
    title="Total Users"
    value={1250}
    description="Active members"
    icon={Users}
    bgColor="bg-blue-100"
    iconColor="text-blue-600"
  />

  <StatCard
    title="Messages"
    value={3420}
    description="Total sent"
    icon={MessageCircle}
    bgColor="bg-green-100"
    iconColor="text-green-600"
    trend={{ value: 12, isPositive: true }}
  />
</div>;
```

### Formatting Data

```tsx
import { formatRelativeTime, formatDate, formatCompactNumber } from "@/lib/utils/format";

// Date
<p>{formatRelativeTime(createdAt)}</p> // "2 hours ago"
<p>{formatDate(createdAt)}</p> // "Dec 5, 2025"

// Numbers
<p>{formatCompactNumber(1500)}</p> // "1.5K"
```

### Form Validation

```tsx
import {
  validateForm,
  validateRequired,
  validateMinLength,
} from "@/lib/utils/validation";

const errors = validateForm(formData, {
  name: [
    (v) => validateRequired(v, "Name"),
    (v) => validateMinLength(v, 2, "Name"),
  ],
  email: [(v) => validateRequired(v, "Email")],
});

if (Object.keys(errors).length > 0) {
  // Show errors
}
```

### Using Constants

```tsx
import { ROUTES, MESSAGES, VALIDATION } from "@/lib/constants";

// Navigation
<Link href={ROUTES.DASHBOARD_PROFILE}>Profile</Link>;

// Messages
toast.success(MESSAGES.LOGIN_SUCCESS);
toast.error(MESSAGES.NETWORK_ERROR);

// Validation
<Input minLength={VALIDATION.PASSWORD_MIN_LENGTH} />;
```

### API Calls in Server Actions

```tsx
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function myAction(data: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(`${API_URL}/endpoint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        /* data */
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Operation failed",
      };
    }

    revalidatePath("/some-path");

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
```

## 📁 Where to Put Things

| What               | Where                   | Example                              |
| ------------------ | ----------------------- | ------------------------------------ |
| Pages              | `app/`                  | `app/dashboard/page.tsx`             |
| Server Actions     | `app/actions/`          | `app/actions/user.actions.ts`        |
| UI Components      | `components/ui/`        | `components/ui/stat-card.tsx`        |
| Feature Components | `components/[feature]/` | `components/threads/thread-card.tsx` |
| Types              | `lib/types/`            | `lib/types/api.types.ts`             |
| Utilities          | `lib/utils/`            | `lib/utils/format.ts`                |
| Constants          | `lib/constants/`        | `lib/constants/index.ts`             |
| Hooks              | `lib/hooks/`            | `lib/hooks/use-auth.ts`              |
| API Client         | `lib/api/`              | `lib/api/client.ts`                  |

## 🎨 Component Import Order

```tsx
// 1. React/Next
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 2. Third-party
import { toast } from "sonner";

// 3. UI Components (shadcn)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Custom UI Components
import { StatCard } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading";

// 5. Feature Components
import { ThreadCard } from "@/components/threads/thread-card";

// 6. Actions
import { getUserAction } from "@/app/actions/user.actions";

// 7. Utils & Helpers
import { formatDate } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants";

// 8. Types
import type { User } from "@/lib/types/api.types";
```

## ⚡ Quick Snippets

### Loading Button

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

### Conditional Alert

```tsx
{
  error && <AlertMessage type="error" message={error} />;
}
{
  success && <AlertMessage type="success" message="Success!" />;
}
```

### Empty State

```tsx
{items.length === 0 ? (
  <div className="text-center py-8 text-gray-500">
    <Icon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
    <p className="font-medium">No items found</p>
    <p className="text-sm mt-1">Try creating one!</p>
  </div>
) : (
  // Show items
)}
```

## 🔍 Available Utilities

### Format Utils

- `formatRelativeTime(date)` - "2 hours ago"
- `formatDate(date, 'short')` - "Dec 5, 2025"
- `formatNumber(1000)` - "1,000"
- `formatCompactNumber(1500)` - "1.5K"
- `truncateText(text, 20)` - Truncate with ellipsis
- `getInitials(name)` - "John Doe" → "JD"

### Validation Utils

- `isValidEmail(email)` - Boolean
- `validatePassword(password)` - { isValid, errors }
- `isValidUrl(url)` - Boolean
- `sanitizeInput(text)` - Clean input
- `isEmpty(text)` - Boolean

### API Utils

- `apiFetch(endpoint, options)` - Fetch wrapper
- `buildQueryString({ page: 1 })` - "?page=1"
- `getAuthHeader(token)` - { Authorization: ... }

## 🎯 Type Definitions

```tsx
import type {
  User,
  UserStats,
  Thread,
  Post,
  Notification,
  ApiResponse,
  ActionResponse,
  Pagination,
} from "@/lib/types/api.types";
```

## 🚦 Common Patterns

### Server Action Response

```tsx
const result = await someAction();

if (result.success) {
  // Handle success
  toast.success(result.message);
} else {
  // Handle error
  setError(result.error);
}
```

### Protected Route

```tsx
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <PageLoader />;

  return (/* Your content */);
}
```

## 📚 Constants Reference

### Routes

- `ROUTES.HOME` - "/"
- `ROUTES.DASHBOARD` - "/dashboard"
- `ROUTES.DASHBOARD_PROFILE` - "/dashboard/profile"
- `ROUTES.DASHBOARD_SETTINGS` - "/dashboard/settings"
- `ROUTES.THREADS` - "/threads"
- `ROUTES.ADMIN` - "/admin"

### Validation

- `VALIDATION.PASSWORD_MIN_LENGTH` - 6
- `VALIDATION.NAME_MIN_LENGTH` - 2
- `VALIDATION.BIO_MAX_LENGTH` - 500

### Messages

- `MESSAGES.LOGIN_SUCCESS`
- `MESSAGES.NETWORK_ERROR`
- `MESSAGES.UNAUTHORIZED`

## 🎉 That's It!

Everything you need to build features quickly and consistently. Check `ARCHITECTURE.md` for detailed explanations.
