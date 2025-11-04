# Quick API Reference Guide

Quick lookup for all available Server Actions in the frontend.

## 🔐 Auth (`auth.actions.ts`)

```typescript
// Register new user
await registerAction(formData); // username, email, password, displayName?

// Login
await loginAction(formData); // email, password

// Verify email
await verifyEmailAction(token);

// Logout
await logoutAction();

// Get current user
await getCurrentUserAction();

// Resend verification
await resendVerificationEmailAction(email);
```

## 🧵 Threads (`thread.actions.ts`)

```typescript
// Create thread
await createThreadAction(formData) // title, content, tags

// Get threads (with filters)
await getThreadsAction(page?, limit?, tags?, search?, sortBy?)

// Get single thread
await getThreadByIdAction(threadId)
await getThreadBySlugAction(slug)

// Update thread
await updateThreadAction(threadId, formData) // title?, content?, tags?

// Delete thread
await deleteThreadAction(threadId)

// Get my threads
await getMyThreadsAction(page?, limit?)

// Search threads
await searchThreadsAction(keyword, page?, limit?)

// AI Summary
await requestThreadSummaryAction(threadId)
await getThreadSummaryAction(threadId)
```

## 💬 Posts (`post.actions.ts`)

```typescript
// Create post (reply)
await createPostAction(formData) // threadId, content

// Get posts in thread
await getPostsByThreadAction(threadId, page?, limit?)

// Get single post
await getPostByIdAction(postId)

// Update post
await updatePostAction(postId, formData) // content

// Delete post
await deletePostAction(postId)

// Get user posts
await getPostsByUserAction(userId, page?, limit?)

// Get flagged posts (admin)
await getFlaggedPostsAction(page?, limit?)
```

## 👤 Users (`user.actions.ts`)

```typescript
// Get all users
await getAllUsersAction(page?, limit?, search?, role?)

// Get user by ID
await getUserByIdAction(userId)

// Get current user profile
await getCurrentUserProfileAction()

// Update profile
await updateUserProfileAction(formData) // displayName?, bio?, location?, website?, avatar?

// Delete user (admin)
await deleteUserAction(userId)
```

## 🔔 Notifications (`notification.actions.ts`)

```typescript
// Get notifications
await getUserNotificationsAction(page?, limit?, isRead?)

// Get unread count
await getUnreadCountAction()

// Get single notification
await getNotificationByIdAction(notificationId)

// Mark as read
await markNotificationAsReadAction(notificationId)
await markAllNotificationsAsReadAction()

// Delete notifications
await deleteNotificationAction(notificationId)
await deleteAllReadNotificationsAction()
```

## 👨‍💼 Admin (`admin.actions.ts`)

```typescript
// Dashboard
await getDashboardStatsAction()

// User Management
await adminGetAllUsersAction(page?, limit?, search?, role?, isBanned?)
await adminUpdateUserAction(userId, formData) // role?, isBanned?, displayName?, bio?
await banUserAction(userId, formData) // reason, duration, notes
await unbanUserAction(userId)

// Reports
await createReportAction(formData) // reportedContentType, reportedContentId, reportType, reason, description
await getAllReportsAction(page?, limit?, status?, reportType?, reportedContentType?)
await getReportByIdAction(reportId)
await takeReportActionAction(reportId, formData) // action, actionReason, status

// Activity & Settings
await getActivityLogsAction(page?, limit?, adminId?)
await getSystemSettingsAction()
await updateSystemSettingsAction(formData)
```

## 📝 Common Patterns

### Form Submission

```tsx
async function handleSubmit(formData: FormData) {
  const result = await someAction(formData);

  if (!result.success) {
    setError(result.error);
    return;
  }

  // Handle success
  toast.success(result.message);
}
```

### Data Fetching in Server Component

```tsx
export default async function Page() {
  const result = await getDataAction();

  if (!result.success) {
    notFound();
  }

  return <div>{/* Render data */}</div>;
}
```

### Pagination

```typescript
const result = await getItemsAction(currentPage, itemsPerPage);
const { items, pagination } = result.data;

// pagination: { page, limit, total, pages }
```

### Authentication Check

```typescript
const user = await getCurrentUserAction();

if (!user) {
  redirect("/login");
}
```

## 🎯 Return Types

All actions return:

```typescript
// Success
{
  success: true,
  data: T,
  message?: string
}

// Error
{
  success: false,
  error: string
}
```

## 🔄 Revalidation

Actions automatically revalidate:

- `revalidatePath("/threads")` - Specific path
- `revalidatePath("/threads/[id]")` - Dynamic routes
- Server components refetch data on navigation

## 🔐 Auth Required

Actions marked **Auth Required** need user to be logged in. They check for `accessToken` cookie.

If not authenticated, they return:

```typescript
{ success: false, error: "Authentication required. Please log in." }
```
