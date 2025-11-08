import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { StartDiscussionButton } from "@/components/threads/start-discussion-button";
import { ThreadsSearchBar } from "@/components/threads/threads-search-bar";
import { ThreadsList } from "@/components/threads/threads-list";
import { ThreadsPagination } from "@/components/threads/threads-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Discussions | Chat Forum",
  description: "Browse all community discussions and join the conversation",
  openGraph: {
    title: "Discussions | Chat Forum",
    description: "Browse all community discussions and join the conversation",
    type: "website",
  },
};

export const revalidate = 60;

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

interface ThreadsResponse {
  threads: Thread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getThreads(searchParams: {
  page?: string;
  search?: string;
  limit?: string;
}): Promise<ThreadsResponse> {
  try {
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 20;
    const search = searchParams.search || "";

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: "-isPinned,-lastActivityAt",
    });

    if (search) {
      queryParams.set("searchTerm", search);
    }

    const response = await fetch(
      `${API_URL}/threads?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }

    const result = await response.json();

    if (result.success && result.data) {
      const totalPages = Math.ceil(result.data.total / result.data.limit);
      return {
        threads: result.data.threads || [],
        total: result.data.total || 0,
        page: result.data.page || 1,
        limit: result.data.limit || 20,
        totalPages,
      };
    }

    return {
      threads: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  } catch (error) {
    console.error("Error fetching threads:", error);
    return {
      threads: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

function ThreadsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ThreadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const data = await getThreads(params);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
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

            <div className="mt-6">
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <ThreadsSearchBar />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<ThreadsLoadingSkeleton />}>
            <ThreadsList threads={data.threads} />
          </Suspense>

          {data.threads.length > 0 && (
            <ThreadsPagination
              currentPage={data.page}
              totalPages={data.totalPages}
              totalItems={data.total}
            />
          )}

          {data.threads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {params.search
                  ? `No discussions found for "${params.search}"`
                  : "No discussions yet. Start the first one!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
