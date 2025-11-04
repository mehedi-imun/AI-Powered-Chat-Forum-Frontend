"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
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
    <div className="space-y-3">
      {threads.map((thread) => (
        <Link
          key={thread._id}
          href={`/threads/${thread._id}`}
          className="block group"
        >
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {thread.title}
            </h3>
            
            {/* Meta + Tags in one line */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                  {(thread.createdBy?.name || "A").charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{thread.createdBy?.name || "Anonymous"}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>
                {formatDistanceToNow(new Date(thread.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{thread.postCount}</span>
              </div>
              {thread.tags.length > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex gap-1.5">
                    {thread.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {thread.tags.length > 2 && (
                      <span className="text-gray-500">+{thread.tags.length - 2}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
