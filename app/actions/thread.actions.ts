"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Thread } from "@/app/types/thread";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create Thread Action
export async function createThreadAction(formData: FormData) {
  const title = formData.get("title") as string;
  const initialPostContent = formData.get("initialPostContent") as string;
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
        initialPostContent,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      }),
    });

    const result: ApiResponse<Thread> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to create thread",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/threads");
    revalidatePath("/dashboard/threads");

    // Redirect to the new thread (use _id, not slug)
    if (result.data?._id) {
      redirect(`/threads/${result.data._id}`);
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
      data: null,
    };
  }
}

// Search Threads Action
export async function searchThreadsAction(
  keyword: string,
  page = 1,
  limit = 10
) {
  try {
    const response = await fetch(
      `${API_URL}/threads/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`,
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
        error: result.message || "Failed to search threads",
        data: null,
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
      data: null,
    };
  }
}

// Get Threads by User Action
export async function getThreadsByUserAction(
  userId: string,
  page = 1,
  limit = 10
) {
  try {
    const response = await fetch(
      `${API_URL}/threads/user/${userId}?page=${page}&limit=${limit}`,
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
        error: result.message || "Failed to fetch user threads",
        data: null,
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
      data: null,
    };
  }
}

// Request Thread Summary Action
export async function requestThreadSummaryAction(threadId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "You must be logged in to request a summary",
      };
    }

    const response = await fetch(`${API_URL}/threads/${threadId}/summary`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: ApiResponse<{ message: string }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to request thread summary",
      };
    }

    // Revalidate thread page
    revalidatePath(`/threads/${threadId}`);

    return {
      success: true,
      message: result.message || "Summary requested successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Get Thread Summary Action
export async function getThreadSummaryAction(threadId: string) {
  try {
    const response = await fetch(`${API_URL}/threads/${threadId}/summary`, {
      cache: "no-store",
    });

    const result: ApiResponse<{
      summary: {
        _id: string;
        threadId: string;
        summary: string;
        keyPoints: string[];
        createdAt: string;
        updatedAt: string;
      };
    }> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch thread summary",
        data: null,
      };
    }

    return {
      success: true,
      data: result.data.summary,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
      data: null,
    };
  }
}
