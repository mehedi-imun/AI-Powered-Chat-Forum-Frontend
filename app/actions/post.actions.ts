"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Post {
  _id: string;
  thread: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  content: string;
  isAcceptedAnswer: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedPosts {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Create a new post (reply) in a thread
 */
export async function createPostAction(formData: FormData) {
  const threadId = formData.get("threadId") as string;
  const content = formData.get("content") as string;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ thread: threadId, content }),
      cache: "no-store",
    });

    const result: ApiResponse<{ post: Post }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to create post",
      };
    }

    // Revalidate the thread page to show new post
    revalidatePath(`/threads/[slug]`, "page");
    revalidatePath("/dashboard/threads");

    return {
      success: true,
      message: result.message,
      data: result.data.post,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Get posts for a specific thread
 */
export async function getPostsByThreadAction(
  threadId: string,
  page = 1,
  limit = 20
) {
  try {
    const response = await fetch(
      `${API_URL}/posts/thread/${threadId}?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    const result: ApiResponse<PaginatedPosts> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch posts",
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
 * Get a single post by ID
 */
export async function getPostByIdAction(postId: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      cache: "no-store",
    });

    const result: ApiResponse<{ post: Post }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch post",
      };
    }

    return {
      success: true,
      data: result.data.post,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePostAction(postId: string, formData: FormData) {
  const content = formData.get("content") as string;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
      cache: "no-store",
    });

    const result: ApiResponse<{ post: Post }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to update post",
      };
    }

    // Revalidate relevant pages
    revalidatePath(`/threads/[slug]`, "page");

    return {
      success: true,
      message: result.message,
      data: result.data.post,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Delete a post
 */
export async function deletePostAction(postId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/posts/${postId}`, {
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
        error: result.message || "Failed to delete post",
      };
    }

    // Revalidate relevant pages
    revalidatePath(`/threads/[slug]`, "page");

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

/**
 * Get posts by a specific user
 */
export async function getPostsByUserAction(
  userId: string,
  page = 1,
  limit = 20
) {
  try {
    const response = await fetch(
      `${API_URL}/posts/user/${userId}?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    const result: ApiResponse<PaginatedPosts> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch user posts",
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
 * Get flagged posts (Admin only)
 */
export async function getFlaggedPostsAction(page = 1, limit = 20) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(
      `${API_URL}/posts/flagged/all?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result: ApiResponse<PaginatedPosts> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch flagged posts",
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
