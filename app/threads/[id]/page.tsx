import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RealTimeReplySection } from "@/components/threads/real-time-reply-section";

interface Thread {
  _id: string;
  title: string;
  slug: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  tags: string[];
  viewCount: number;
  postCount: number;
  isPinned: boolean;
  isLocked: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

interface Post {
  _id: string;
  threadId: string;
  parentId: string | null;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  mentions: string[];
  isEdited: boolean;
  moderationStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  replies?: Post[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return null;
  }
}

async function getPosts(threadId: string): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/posts/thread/${threadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch posts:", response.statusText);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data?.posts) {
      return result.data.posts;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const thread = await getThread(id);
  const posts = await getPosts(id);

  if (!thread) {
    return {
      title: "Thread Not Found",
    };
  }

  const description = posts[0]?.content?.slice(0, 160) || thread.title;

  return {
    title: `${thread.title} | Chat Forum`,
    description,
    openGraph: {
      title: thread.title,
      description,
      type: "article",
    },
  };
}

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getThread(id);
  const posts = await getPosts(id);

  if (!thread) {
    notFound();
  }

  // First post is the initial thread content
  const initialPost = posts[0];
  // Remaining posts are replies - map to match ReplySection interface
  const replies = posts.slice(1).map((post) => ({
    _id: post._id,
    content: post.content,
    author: {
      _id: post.author._id,
      username: post.author.email.split("@")[0], // Use email prefix as username
      displayName: post.author.name,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

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
                  <span>
                    {initialPost?.author?.name ||
                      thread.createdBy?.name ||
                      "Anonymous"}
                  </span>
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
                {initialPost?.content
                  ?.split("\n")
                  .map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  )) || <p className="text-gray-500">No content available.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Reply Section with Real-Time Updates */}
          <RealTimeReplySection
            threadId={thread._id}
            initialReplies={replies}
          />

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
