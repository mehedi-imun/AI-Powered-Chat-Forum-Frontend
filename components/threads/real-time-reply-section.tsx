"use client";

import { useEffect, useState } from "react";
import { ReplySection } from "./reply-section";
import { useSocket } from "@/components/providers/socket-provider";

interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
  };
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RealTimeReplySectionProps {
  threadId: string;
  initialReplies: Reply[];
}

interface SocketPostData {
  post: {
    _id: string;
    threadId: string;
    parentId?: string | null;
    content: string;
    author: {
      _id: string;
      name: string;
      email?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

interface SocketPostDeleteData {
  postId: string;
}

export function RealTimeReplySection({
  threadId,
  initialReplies,
}: RealTimeReplySectionProps) {
  const { socket, isConnected } = useSocket();
  const [replies, setReplies] = useState(initialReplies);

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⏳ Socket not connected, skipping real-time setup");
      return;
    }

    console.log("🔌 Setting up real-time listeners for thread:", threadId);

    // Join the thread room
    socket.emit("thread:join", threadId);

    // Listen for new posts in this thread
    socket.on("new-post", (data: SocketPostData) => {
      console.log("📨 Received new post:", data);

      // Check if the post belongs to this thread
      if (data.post?.threadId === threadId) {
        const newReply: Reply = {
          _id: data.post._id,
          content: data.post.content,
          author: {
            _id: data.post.author._id,
            username: data.post.author.email?.split("@")[0] || "user",
            displayName: data.post.author.name,
          },
          parentId: data.post.parentId || null,
          createdAt: data.post.createdAt,
          updatedAt: data.post.updatedAt,
        };

        // Add the new reply to the list
        setReplies((prev) => [...prev, newReply]);
      }
    });

    // Listen for post updates (edits, moderation changes)
    socket.on("post-updated", (data: SocketPostData) => {
      console.log("✏️ Post updated:", data);

      if (data.post?.threadId === threadId) {
        setReplies((prev) =>
          prev.map((reply) =>
            reply._id === data.post._id
              ? {
                  ...reply,
                  content: data.post.content,
                  updatedAt: data.post.updatedAt,
                }
              : reply
          )
        );
      }
    });

    // Listen for post deletions
    socket.on("post-deleted", (data: SocketPostDeleteData) => {
      console.log("🗑️ Post deleted:", data);

      if (data.postId) {
        setReplies((prev) => prev.filter((reply) => reply._id !== data.postId));
      }
    });

    // Cleanup: leave thread room and remove listeners
    return () => {
      console.log("🧹 Cleaning up real-time listeners for thread:", threadId);
      socket.emit("thread:leave", threadId);
      socket.off("new-post");
      socket.off("post-updated");
      socket.off("post-deleted");
    };
  }, [socket, isConnected, threadId]);

  return (
    <>
      {/* Show connection status indicator if not connected */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          ⚠️ Real-time updates are currently unavailable. Refresh the page to
          see new replies.
        </div>
      )}

      {/* Pass the live-updated replies to ReplySection */}
      <ReplySection threadId={threadId} replies={replies} />
    </>
  );
}
