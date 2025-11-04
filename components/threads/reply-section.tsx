"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


import {
  LogIn,
  MessageSquare,
  CornerDownRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/hooks/use-auth";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction } from "@/app/actions/post.actions";

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

interface ReplySectionProps {
  threadId: string;
  replies: Reply[];
}

interface ReplyCardProps {
  reply: Reply;
  childrenReplies: Record<string, Reply[]>;
  onReply: (parentId: string) => void;
  isAuthenticated: boolean;
  depth?: number;
}

// Recursive component to display nested replies - Discord/Twitter style
function ReplyCard({
  reply,
  childrenReplies,
  onReply,
  isAuthenticated,
  depth = 0,
}: ReplyCardProps) {
  const maxDepth = 5;
  const hasChildren = childrenReplies[reply._id]?.length > 0;
  const replyCount = childrenReplies[reply._id]?.length || 0;
  
  // Compact indent - only left border, no card background
  const indentClass = depth > 0 ? "ml-8 pl-3 border-l-2 border-gray-200" : "";

  return (
    <div className={indentClass}>
      <div className="group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
        {/* Header - Avatar + Name + Time (single line) */}
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {(reply.author.displayName || reply.author.username)
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">
                {reply.author.displayName || reply.author.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {/* Content - no padding */}
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
              {reply.content}
            </p>
            {/* Actions - compact inline */}
            <div className="flex items-center gap-4 mt-2">
              {isAuthenticated && depth < maxDepth && (
                <button
                  type="button"
                  onClick={() => onReply(reply._id)}
                  className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <CornerDownRight className="h-3 w-3" />
                  Reply
                </button>
              )}
              {hasChildren && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {replyCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested replies - minimal spacing */}
      {hasChildren && depth < maxDepth && (
        <div className="mt-2 space-y-0">
          {childrenReplies[reply._id].map((childReply) => (
            <ReplyCard
              key={childReply._id}
              reply={childReply}
              childrenReplies={childrenReplies}
              onReply={onReply}
              isAuthenticated={isAuthenticated}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}export function ReplySection({
  threadId,
  replies: initialReplies,
}: ReplySectionProps) {
  const { isAuthenticated } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToUsername, setReplyingToUsername] = useState<string>("");

  const handleSubmitReply = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", replyContent);
    formData.append("thread", threadId);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    const result = await createPostAction(formData);

    if (result.success) {
      setReplyContent("");
      setReplyingTo(null);
      // Optimistically add the reply (in real app, refetch from server)
      window.location.reload(); // Simple reload for now
    } else {
      setError(result.error || "Failed to post reply");
    }

    setIsSubmitting(false);
  };

  // Organize replies into a tree structure
  const organizeReplies = (
    replies: Reply[]
  ): { topLevel: Reply[]; children: Record<string, Reply[]> } => {
    const topLevel: Reply[] = [];
    const children: Record<string, Reply[]> = {};

    for (const reply of replies) {
      if (!reply.parentId) {
        topLevel.push(reply);
      } else {
        if (!children[reply.parentId]) {
          children[reply.parentId] = [];
        }
        children[reply.parentId].push(reply);
      }
    }

    return { topLevel, children };
  };

  const { topLevel, children } = organizeReplies(initialReplies);

  return (
    <>
      {/* Reply Form - Compact Twitter/Discord style */}
      {isAuthenticated ? (
        <div className="mb-6">
          {/* Replying to indicator - minimal */}
          {replyingTo && replyingToUsername && (
            <div className="mb-2 flex items-center gap-2 text-sm">
              <CornerDownRight className="h-3 w-3 text-blue-600" />
              <span className="text-gray-600">
                Replying to <span className="font-semibold text-gray-900">@{replyingToUsername}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyingToUsername("");
                }}
                className="text-gray-400 hover:text-gray-600 ml-auto"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Compact form */}
          <form
            onSubmit={(e) => handleSubmitReply(e, replyingTo || undefined)}
            className="border border-gray-200 rounded-lg focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all bg-white"
          >
            <Textarea
              placeholder={
                replyingTo
                  ? `Reply to @${replyingToUsername}...`
                  : "Write a reply..."
              }
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-20 border-0 focus-visible:ring-0 resize-none text-sm"
              disabled={isSubmitting}
            />
            {error && (
              <div className="px-3 pb-2">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t bg-gray-50">
              <Button 
                type="submit" 
                disabled={isSubmitting || !replyContent.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Posting..." : "Reply"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              Sign in to join the discussion
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Replies List - Compact */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 pb-2 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            {initialReplies.length} {initialReplies.length === 1 ? "Reply" : "Replies"}
          </h2>
        </div>

        {initialReplies.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              No replies yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topLevel.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                childrenReplies={children}
                onReply={(parentId: string) => {
                  // Find the reply being replied to
                  const findReply = (replies: Reply[]): Reply | undefined => {
                    for (const r of replies) {
                      if (r._id === parentId) return r;
                      if (children[r._id]) {
                        const found = findReply(children[r._id]);
                        if (found) return found;
                      }
                    }
                    return undefined;
                  };
                  
                  const targetReply = findReply(initialReplies);
                  setReplyingTo(parentId);
                  setReplyingToUsername(
                    targetReply?.author.displayName || 
                    targetReply?.author.username || 
                    "User"
                  );
                  // Scroll to reply form
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
