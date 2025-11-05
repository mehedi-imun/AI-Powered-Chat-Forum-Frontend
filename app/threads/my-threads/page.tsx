import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Navbar } from "@/app/components/landing/navbar";
import { Footer } from "@/app/components/landing/footer";
import { StartDiscussionButton } from "@/app/components/threads/start-discussion-button";
import { RealTimeThreadList } from "@/app/components/threads/real-time-thread-list";
import { jwtDecode } from "jwt-decode";

export const metadata: Metadata = {
  title: "My Threads | Chat Forum",
  description: "View and manage your discussion threads",
  openGraph: {
    title: "My Threads | Chat Forum",
    description: "View and manage your discussion threads",
    type: "website",
  },
};

interface Thread {
  _id: string;
  title: string;
  slug: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  tags: string[];
  viewCount: number;
  postCount: number;
  status: string;
  isPinned: boolean;
  isLocked: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMyThreads(): Promise<Thread[]> {
  try {
    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      redirect("/login");
    }

    // Decode JWT to get userId
    const decoded = jwtDecode<JWTPayload>(accessToken);
    const userId = decoded.userId;

    if (!userId) {
      console.error("No userId found in token");
      return [];
    }

    const response = await fetch(
      `${API_URL}/threads/user/${userId}?sort=-createdAt&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch my threads:", response.statusText);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data?.threads) {
      return result.data.threads;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch my threads:", error);
    return [];
  }
}

export default async function MyThreadsPage() {
  const threads = await getMyThreads();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Threads</h1>
                <p className="text-gray-600">
                  View and manage your discussion threads
                </p>
              </div>
              <StartDiscussionButton />
            </div>
          </div>

          {/* My Threads List with Real-Time Updates */}
          <RealTimeThreadList initialThreads={threads} />

          {/* Stats */}
          {threads.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="text-sm text-gray-500">
                You have created {threads.length}{" "}
                {threads.length === 1 ? "thread" : "threads"}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
