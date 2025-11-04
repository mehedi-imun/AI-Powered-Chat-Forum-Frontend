"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/components/providers/socket-provider";

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

interface SocketThreadData {
  thread: Thread;
}

interface RealTimeThreadListProps {
  initialThreads: Thread[];
}

export function RealTimeThreadList({
  initialThreads,
}: RealTimeThreadListProps) {
  const { socket, isConnected } = useSocket();
  const [threads, setThreads] = useState(initialThreads);

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⏳ Socket not connected, skipping real-time setup");
      return;
    }

    console.log("🔌 Setting up real-time listeners for thread list");

    // Listen for new threads
    socket.on("new-thread", (data: SocketThreadData) => {
      console.log("📨 Received new thread:", data);
      
      if (data.thread) {
        // Add new thread to the top of the list
        setThreads((prev) => [data.thread, ...prev]);
      }
    });

    // Listen for thread updates
    socket.on("thread-updated", (data: SocketThreadData) => {
      console.log("✏️ Thread updated:", data);
      
      if (data.thread) {
        setThreads((prev) =>
          prev.map((thread) =>
            thread._id === data.thread._id ? data.thread : thread
          )
        );
      }
    });

    // Listen for thread deletions
    socket.on("thread-deleted", (data: { threadId: string }) => {
      console.log("🗑️ Thread deleted:", data);
      
      if (data.threadId) {
        setThreads((prev) =>
          prev.filter((thread) => thread._id !== data.threadId)
        );
      }
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up real-time thread list listeners");
      socket.off("new-thread");
      socket.off("thread-updated");
      socket.off("thread-deleted");
    };
  }, [socket, isConnected]);

  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No threads yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to start a discussion!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card
          key={thread._id}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  <Link
                    href={`/threads/${thread._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {thread.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      {thread.createdBy?.name || "Anonymous"}
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
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.postCount} posts</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/threads/${thread._id}`}
                className="ml-4 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
