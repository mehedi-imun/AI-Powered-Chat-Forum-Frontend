"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogIn, Clock, MessageSquare, CornerDownRight } from "lucide-react";
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

// Recursive component to display nested replies
function ReplyCard({
  reply,
  childrenReplies,
  onReply,
  isAuthenticated,
  depth = 0,
}: ReplyCardProps) {
  const maxDepth = 5; // Limit nesting depth to prevent UI issues
  const hasChildren = childrenReplies[reply._id]?.length > 0;
  const replyCount = childrenReplies[reply._id]?.length || 0;

  // Visual styling based on depth
  const indentClass = depth > 0 ? "ml-6 border-l-3 border-blue-300 pl-4" : "";
  const cardBgClass = depth > 0 ? "bg-blue-50/30" : "";

  return (
    <div className={indentClass}>
      <Card className={cardBgClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                {(reply.author.displayName || reply.author.username)
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {reply.author.displayName || reply.author.username}
                </span>
                {depth > 0 && (
                  <span className="ml-2 text-xs text-blue-600 font-medium">
                    • Nested Reply
                  </span>
                )}
              </div>
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
        <CardContent className="pt-0">
          <p className="text-gray-700 whitespace-pre-wrap mb-3 leading-relaxed">
            {reply.content}
          </p>
          <div className="flex items-center gap-3">
            {isAuthenticated && depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(reply._id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <CornerDownRight className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            {hasChildren && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Render nested replies recursively */}
      {hasChildren && depth < maxDepth && (
        <div className="mt-3 space-y-3">
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
}

export function ReplySection({
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
      {/* Reply Form or Login CTA */}
      {isAuthenticated ? (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {replyingTo ? "Reply to Comment" : "Post a Reply"}
              </h3>
              {replyingTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => handleSubmitReply(e, replyingTo || undefined)}
            >
              <Textarea
                placeholder={
                  replyingTo
                    ? "Write your reply to this comment..."
                    : "Write your reply..."
                }
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-4 min-h-[120px]"
                disabled={isSubmitting}
              />
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
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
      )}

      {/* Replies List */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Replies ({initialReplies.length})
        </h2>

        {initialReplies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-600">
              No replies yet. Be the first to reply!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topLevel.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                childrenReplies={children}
                onReply={(parentId: string) => {
                  setReplyingTo(parentId);
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
