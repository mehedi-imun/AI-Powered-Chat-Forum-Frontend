import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  content: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
  };
  replyCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">All Discussions</h1>
              <p className="text-gray-600">
                Browse and explore community discussions
              </p>
            </div>
            <Button asChild>
              <Link href="/login">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Discussion
              </Link>
            </Button>
          </div>

          {/* Threads List */}
          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No discussions yet. Be the first to start one!
                </p>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {threads.map((thread) => (
                <Card
                  key={thread._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/threads/${thread._id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {thread.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {thread.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{thread.author.displayName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{thread.replyCount} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(thread.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/threads/${thread._id}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
