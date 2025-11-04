"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Thread } from "@/types/thread";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create Thread Action
export async function createThreadAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in to create a thread",
      };
    }

    const response = await fetch(`${API_URL}/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      }),
    });

    const result: ApiResponse<{ thread: Thread }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to create thread",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/threads");
    revalidatePath("/dashboard/threads");

    // Redirect to the new thread
    redirect(`/threads/${result.data.thread.slug}`);
  } catch (error) {
    // Handle redirect from try block
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Update Thread Action
export async function updateThreadAction(threadId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in to update a thread",
      };
    }

    const response = await fetch(`${API_URL}/threads/${threadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const result: ApiResponse<{ thread: Thread }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to update thread",
      };
    }

    // Revalidate relevant paths
    revalidatePath(`/threads/${result.data.thread.slug}`);
    revalidatePath("/threads");
    revalidatePath("/dashboard/threads");

    return {
      success: true,
      thread: result.data.thread,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Delete Thread Action
export async function deleteThreadAction(threadId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in to delete a thread",
      };
    }

    const response = await fetch(`${API_URL}/threads/${threadId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: ApiResponse<unknown> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to delete thread",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/threads");
    revalidatePath("/dashboard/threads");

    // Redirect to dashboard threads
    redirect("/dashboard/threads");
  } catch (error) {
    // Handle redirect from try block
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Get All Threads Action (for SSR)
export async function getThreadsAction(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_URL}/threads?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    const result: ApiResponse<{
      threads: Thread[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch threads",
        data: null,
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
      data: null,
    };
  }
}

// Get Single Thread Action (for SSR)
export async function getThreadAction(slug: string) {
  try {
    const response = await fetch(`${API_URL}/threads/${slug}`, {
      cache: "no-store",
    });

    const result: ApiResponse<{ thread: Thread }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Thread not found",
        data: null,
      };
    }

    return {
      success: true,
      data: result.data.thread,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
      data: null,
    };
  }
}

// Get User's Threads Action
export async function getMyThreadsAction(page = 1, limit = 10) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in",
        data: null,
      };
    }

    const response = await fetch(
      `${API_URL}/threads/my-threads?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result: ApiResponse<{
      threads: Thread[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch your threads",
        data: null,
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
      data: null,
    };
  }
}
