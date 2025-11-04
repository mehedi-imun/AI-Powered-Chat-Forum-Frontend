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
    username: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  _id: string;
  content: string;
  author: {
    username: string;
    displayName: string;
  };
  createdAt: string;
}

async function getThread(id: string): Promise<Thread | null> {
  try {
    // In production, fetch from backend API
    // Mock data for now
    const threads: Record<string, Thread> = {
      "1": {
        _id: "1",
        title: "Welcome to Chat Forum!",
        content:
          "This is a sample thread to demonstrate the public thread detail page. In a real application, this content would be fetched from your backend API using Server Components.\n\nYou can write longer content here with multiple paragraphs to show how the thread detail page displays full content.\n\nFeel free to explore the features and join the discussion!",
        author: {
          username: "admin",
          displayName: "Admin",
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      "2": {
        _id: "2",
        title: "How to get started with Next.js 16?",
        content:
          "I'm new to Next.js and want to learn about the App Router and Server Components. Any recommendations?\n\nI've heard that Next.js 16 has some great new features, especially around Turbopack and Server Actions. What are the best resources to learn these concepts?\n\nAlso, are there any good starter templates or boilerplates that showcase best practices?",
        author: {
          username: "developer123",
          displayName: "Developer",
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      "3": {
        _id: "3",
        title: "Best practices for TypeScript in React",
        content:
          "What are your favorite TypeScript patterns and best practices when building React applications?\n\nI'm particularly interested in:\n- Type-safe form handling\n- API response typing\n- Proper use of generics\n- Avoiding 'any' types\n\nAny suggestions or resources would be appreciated!",
        author: {
          username: "typescript_lover",
          displayName: "TS Enthusiast",
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    return threads[id] || null;
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return null;
  }
}

async function getReplies(threadId: string): Promise<Reply[]> {
  try {
    // Mock replies
    if (threadId === "1") {
      return [
        {
          _id: "r1",
          content:
            "Thanks for the welcome! This looks like a great platform. Looking forward to participating in discussions.",
          author: {
            username: "newuser",
            displayName: "New User",
          },
          createdAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          _id: "r2",
          content:
            "I agree! The UI looks clean and modern. Excited to see this community grow.",
          author: {
            username: "community_member",
            displayName: "Community Member",
          },
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
      ];
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
                  <span>{thread.author.displayName}</span>
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
