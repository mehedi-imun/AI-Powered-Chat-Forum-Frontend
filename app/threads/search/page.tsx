import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  User,
  Clock,
  ArrowLeft,
  Search as SearchIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SearchBar } from "@/components/threads/search-bar";

export const metadata: Metadata = {
  title: "Search Results | Chat Forum",
  description: "Search through community discussions",
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
  lastActivityAt: string;
  createdAt: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function searchThreads(keyword: string): Promise<Thread[]> {
  if (!keyword) return [];

  try {
    const response = await fetch(
      `${API_URL}/threads/search?keyword=${encodeURIComponent(
        keyword
      )}&limit=20`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to search threads:", response.statusText);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data?.threads) {
      return result.data.threads;
    }

    return [];
  } catch (error) {
    console.error("Failed to search threads:", error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const threads = await searchThreads(query);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/threads"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all discussions
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <SearchIcon className="h-8 w-8 text-gray-400" />
              <div>
                <h1 className="text-3xl font-bold">Search Results</h1>
                {query && (
                  <p className="text-gray-600 mt-1">
                    Showing results for &ldquo;
                    <span className="font-medium">{query}</span>&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar />
          </div>

          {/* Results */}
          {!query ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Enter a keyword to search discussions
                </p>
              </CardContent>
            </Card>
          ) : threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No results found for &ldquo;
                  <span className="font-medium">{query}</span>&rdquo;
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Try different keywords or browse all discussions
                </p>
                <Button asChild>
                  <Link href="/threads">Browse All Discussions</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Found {threads.length}{" "}
                {threads.length === 1 ? "result" : "results"}
              </p>

              {threads.map((thread) => (
                <Card
                  key={thread._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/threads/${thread._id}`}
                          className="hover:text-primary"
                        >
                          <CardTitle className="text-xl mb-2 hover:underline">
                            {thread.title}
                          </CardTitle>
                        </Link>

                        {thread.tags && thread.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {thread.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{thread.createdBy?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(thread.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>
                          {thread.postCount}{" "}
                          {thread.postCount === 1 ? "reply" : "replies"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
