import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { StartDiscussionButton } from "@/components/threads/start-discussion-button";
import { SearchBar } from "@/components/threads/search-bar";
import { RealTimeThreadList } from "@/components/threads/real-time-thread-list";

export const metadata: Metadata = {
  title: "Discussions | Chat Forum",
  description: "Browse all community discussions and join the conversation",
  openGraph: {
    title: "Discussions | Chat Forum",
    description: "Browse all community discussions and join the conversation",
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getThreads(): Promise<Thread[]> {
  try {
    const response = await fetch(
      `${API_URL}/threads?sort=-createdAt&limit=20`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch threads:", response.statusText);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data?.threads) {
      return result.data.threads;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return [];
  }
}

export default async function ThreadsPage() {
  const threads = await getThreads();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">All Discussions</h1>
                <p className="text-gray-600">
                  Browse and explore community discussions
                </p>
              </div>
              <StartDiscussionButton />
            </div>

            {/* Search Bar */}
            <div className="mt-6">
              <SearchBar />
            </div>
          </div>

          {/* Threads List with Real-Time Updates */}
          <RealTimeThreadList initialThreads={threads} />

          {/* Pagination placeholder */}
          {threads.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="text-sm text-gray-500">
                Showing {threads.length} discussions
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
