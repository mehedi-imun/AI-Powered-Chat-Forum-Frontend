import { cookies } from "next/headers";

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const url = `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function publicApiClient<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}
