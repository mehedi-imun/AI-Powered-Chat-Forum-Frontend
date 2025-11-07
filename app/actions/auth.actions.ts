"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    displayName?: string;
    avatar?: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

// Register Action
export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result: ApiResponse<{ user: { email: string } }> =
      await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Registration failed",
      };
    }

    // Return success - user needs to verify email
    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      email: result.data.user.email,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Login Action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result: ApiResponse<AuthResponse> = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Invalid email or password",
      };
    }

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
    
    });

    cookieStore.set("userRole", result.data.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: result.data.user,
      token: result.data.accessToken,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Verify Email Action
export async function verifyEmailAction(token: string) {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Email verification failed",
      };
    }

    // After successful verification, automatically log in the user
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userRole", result.data.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      user: result.data.user,
      token: result.data.accessToken,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Logout Action
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("userRole");
  }

  redirect("/login");
}

// Get Current User Action
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const result: ApiResponse<{ user: AuthResponse["user"] }> =
      await response.json();
    return result.data.user;
  } catch (error) {
    return null;
  }
}

// Resend Verification Email Action
export async function resendVerificationEmailAction(email: string) {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result: ApiResponse<unknown> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to resend verification email",
      };
    }

    return {
      success: true,
      message: "Verification email sent! Please check your inbox.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
