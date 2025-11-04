"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  _id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: "User" | "Admin" | "Moderator";
  reputation: number;
  isBanned: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedUsers {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get all users (with pagination and filters)
 */
export async function getAllUsersAction(
  page = 1,
  limit = 20,
  search?: string,
  role?: string
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (role) params.append("role", role);

    const response = await fetch(`${API_URL}/users?${params.toString()}`, {
      cache: "no-store",
    });

    const result: ApiResponse<PaginatedUsers> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch users",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Get a single user by ID
 */
export async function getUserByIdAction(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      cache: "no-store",
    });

    const result: ApiResponse<{ user: User }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch user",
      };
    }

    return {
      success: true,
      data: result.data.user,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfileAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ApiResponse<{ user: User }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      data: result.data.user,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfileAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    // Build update object from formData
    const updateData: Record<string, string> = {};
    
    const displayName = formData.get("displayName") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const avatar = formData.get("avatar") as string;

    if (displayName) updateData.displayName = displayName;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (website) updateData.website = website;
    if (avatar) updateData.avatar = avatar;

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
      cache: "no-store",
    });

    const result: ApiResponse<{ user: User }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to update profile",
      };
    }

    // Revalidate profile pages
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: result.message,
      data: result.data.user,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Delete user account (Admin only)
 */
export async function deleteUserAction(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
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
        error: result.message || "Failed to delete user",
      };
    }

    // Revalidate admin pages
    revalidatePath("/admin/users");

    return {
      success: true,
      message: result.message,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
