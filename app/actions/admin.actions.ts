/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Get dashboard statistics (Admin/Moderator only)
 */
export async function getDashboardStatsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/admin/dashboard`, {
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch dashboard stats",
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
 * Get all users (Admin/Moderator only)
 */
export async function adminGetAllUsersAction(
  page = 1,
  limit = 20,
  search?: string,
  role?: string,
  isBanned?: boolean
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

    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (isBanned !== undefined) params.append("isBanned", isBanned.toString());

    const response = await fetch(
      `${API_URL}/admin/users?${params.toString()}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    const result: ApiResponse<any> = await response.json();

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
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Update user (Admin only)
 */
export async function adminUpdateUserAction(
  userId: string,
  formData: FormData
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

    // Build update object from formData
    const updateData: Record<string, any> = {};

    const role = formData.get("role") as string;
    const isBanned = formData.get("isBanned") as string;
    const displayName = formData.get("displayName") as string;
    const bio = formData.get("bio") as string;

    if (role) updateData.role = role;
    if (isBanned) updateData.isBanned = isBanned === "true";
    if (displayName) updateData.displayName = displayName;
    if (bio) updateData.bio = bio;

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to update user",
      };
    }

    // Revalidate admin pages
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

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
 * Ban user (Admin/Moderator only)
 */
export async function banUserAction(userId: string, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const reason = formData.get("reason") as string;
    const duration = formData.get("duration") as string;
    const notes = formData.get("notes") as string;

    const response = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, duration, notes }),
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to ban user",
      };
    }

    // Revalidate admin pages
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

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
 * Unban user (Admin/Moderator only)
 */
export async function unbanUserAction(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to unban user",
      };
    }

    // Revalidate admin pages
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

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
 * Create a report
 */
export async function createReportAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const reportedContentType = formData.get("reportedContentType") as string;
    const reportedContentId = formData.get("reportedContentId") as string;
    const reportType = formData.get("reportType") as string;
    const reason = formData.get("reason") as string;
    const description = formData.get("description") as string;

    const response = await fetch(`${API_URL}/admin/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportedContentType,
        reportedContentId,
        reportType,
        reason,
        description,
      }),
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to create report",
      };
    }

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
 * Get all reports (Admin/Moderator only)
 */
export async function getAllReportsAction(
  page = 1,
  limit = 20,
  status?: string,
  reportType?: string,
  reportedContentType?: string
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

    if (status) params.append("status", status);
    if (reportType) params.append("reportType", reportType);
    if (reportedContentType)
      params.append("reportedContentType", reportedContentType);

    const response = await fetch(
      `${API_URL}/admin/reports?${params.toString()}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch reports",
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
 * Get report by ID (Admin/Moderator only)
 */
export async function getReportByIdAction(reportId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch report",
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
 * Take action on a report (Admin/Moderator only)
 */
export async function takeReportActionAction(
  reportId: string,
  formData: FormData
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

    const action = formData.get("action") as string;
    const actionReason = formData.get("actionReason") as string;
    const status = formData.get("status") as string;

    const response = await fetch(
      `${API_URL}/admin/reports/${reportId}/action`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, actionReason, status }),
        cache: "no-store",
        credentials: "include",
      }
    );

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to take action on report",
      };
    }

    // Revalidate report pages
    revalidatePath("/admin/reports");
    revalidatePath(`/admin/reports/${reportId}`);

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
 * Get activity logs (Admin only)
 */
export async function getActivityLogsAction(
  page = 1,
  limit = 50,
  adminId?: string
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

    if (adminId) params.append("adminId", adminId);

    const response = await fetch(
      `${API_URL}/admin/activity-logs?${params.toString()}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch activity logs",
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
 * Get system settings (Admin only)
 */
export async function getSystemSettingsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    const response = await fetch(`${API_URL}/admin/settings`, {
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch system settings",
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
 * Update system settings (Admin only)
 */
export async function updateSystemSettingsAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    // Build settings object from formData
    const settings: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      // Convert string booleans to actual booleans
      if (value === "true") settings[key] = true;
      else if (value === "false") settings[key] = false;
      // Convert string numbers to actual numbers
      else if (!isNaN(Number(value)) && value !== "")
        settings[key] = Number(value);
      else settings[key] = value;
    }

    const response = await fetch(`${API_URL}/admin/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
      cache: "no-store",
      credentials: "include",
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to update system settings",
      };
    }

    // Revalidate settings page
    revalidatePath("/admin/settings");

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
