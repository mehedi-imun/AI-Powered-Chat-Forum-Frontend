"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Notification {
  _id: string;
  user: string;
  type: "mention" | "reply" | "follow" | "like" | "system";
  title: string;
  message: string;
  relatedThread?: {
    _id: string;
    title: string;
    slug: string;
  };
  relatedPost?: {
    _id: string;
    content: string;
  };
  relatedUser?: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get all notifications for the current user
 */
export async function getUserNotificationsAction(
  page = 1,
  limit = 20,
  isRead?: boolean
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (isRead !== undefined) params.append("isRead", isRead.toString());

    const response = await fetch(`${API_URL}/notifications?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<PaginatedNotifications> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch notifications",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCountAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ unreadCount: number }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch unread count",
      };
    }

    return {
      success: true,
      data: result.data.unreadCount,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Get a single notification by ID
 */
export async function getNotificationByIdAction(notificationId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ notification: Notification }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch notification",
      };
    }

    return {
      success: true,
      data: result.data.notification,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsReadAction(notificationId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ notification: Notification }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to mark notification as read",
      };
    }

    // Revalidate notification pages
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message,
      data: result.data.notification,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ modifiedCount: number }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to mark all notifications as read",
      };
    }

    // Revalidate notification pages
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(notificationId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<null> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to delete notification",
      };
    }

    // Revalidate notification pages
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Delete all read notifications
 */
export async function deleteAllReadNotificationsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/notifications/read/all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ deletedCount: number }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to delete read notifications",
      };
    }

    // Revalidate notification pages
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
