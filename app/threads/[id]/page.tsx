import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Clock, MessageSquare, LogIn } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getThread(id: string): Promise<Thread | null> {
  try {
    const response = await fetch(`${API_URL}/threads/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch thread:", response.statusText);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.data?.thread) {
      return result.data.thread;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return null;
  }
}

async function getReplies(threadId: string): Promise<Reply[]> {
  try {
    const response = await fetch(`${API_URL}/posts?thread=${threadId}&sort=createdAt`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch replies:", response.statusText);
      return [];
    }

    const result = await response.json();
    
    if (result.success && result.data?.posts) {
      return result.data.posts;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const thread = await getThread(params.id);

  if (!thread) {
    return {
      title: "Thread Not Found",
    };
  }

  return {
    title: `${thread.title} | Chat Forum`,
    description: thread.content.slice(0, 160),
    openGraph: {
      title: thread.title,
      description: thread.content.slice(0, 160),
      type: "article",
    },
  };
}

export default async function ThreadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const thread = await getThread(params.id);
  const replies = await getReplies(params.id);

  if (!thread) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            {" / "}
            <Link href="/threads" className="hover:text-primary">
              Discussions
            </Link>
            {" / "}
            <span className="text-gray-900">{thread.title}</span>
          </div>

          {/* Thread Content */}
          <Card className="mb-6">
            <CardHeader>
              <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{thread.author.displayName || thread.author.username}</span>
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
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {thread.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Login to Reply CTA */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <LogIn className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-900">
                Want to join the discussion? Sign in to reply.
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Replies ({replies.length})
            </h2>

            {replies.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-600">
                  No replies yet. Be the first to reply!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <Card key={reply._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">
                            {reply.author.displayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{reply.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                Ready to join the conversation?
              </h3>
              <p className="text-gray-600 mb-4">
                Create an account to reply to threads and start your own
                discussions.
              </p>
              <Button asChild size="lg">
                <Link href="/register">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
