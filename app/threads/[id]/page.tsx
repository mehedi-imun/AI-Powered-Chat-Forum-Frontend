import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, MessageSquare } from "lucide-react";
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

  // Flatten all replies including nested ones for the reply section
  const flattenReplies = (
    postsList: Post[]
  ): Array<{
    _id: string;
    content: string;
    author: { _id: string; username: string; displayName: string };
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  }> => {
    const result: Array<{
      _id: string;
      content: string;
      author: { _id: string; username: string; displayName: string };
      parentId: string | null;
      createdAt: string;
      updatedAt: string;
    }> = [];

    for (const post of postsList) {
      // Add this post
      result.push({
        _id: post._id,
        content: post.content,
        author: {
          _id: post.author._id,
          username: post.author.email?.split("@")[0] || "user",
          displayName: post.author.name,
        },
        parentId: post.parentId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });

      // If it has nested replies, flatten them recursively
      if (post.replies && post.replies.length > 0) {
        result.push(...flattenReplies(post.replies));
      }
    }

    return result;
  };

  // Get all replies (excluding initial post) and flatten nested structure
  const replies = flattenReplies(posts.slice(1));

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

          {/* Thread Content - Compact */}
          <Card className="mb-6 border border-gray-200">
            <CardHeader className="pb-3">
              <h1 className="text-2xl font-bold mb-3">{thread.title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {(
                      initialPost?.author?.name ||
                      thread.createdBy?.name ||
                      "A"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">
                    {initialPost?.author?.name ||
                      thread.createdBy?.name ||
                      "Anonymous"}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(thread.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>
                    {thread.postCount}{" "}
                    {thread.postCount === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-700 leading-relaxed">
                {initialPost?.content
                  ?.split("\n")
                  .map((paragraph: string, index: number) => (
                    <p key={index} className="mb-3">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
