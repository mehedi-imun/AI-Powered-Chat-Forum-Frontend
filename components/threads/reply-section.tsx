"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogIn, User, Clock, MessageSquare, CornerDownRight } from "lucide-react";
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

export function ReplySection({
  threadId,
  replies: initialReplies,
}: ReplySectionProps) {
  const { isAuthenticated } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
            <h3 className="text-lg font-semibold">Post a Reply</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply}>
              <Textarea
                placeholder="Write your reply..."
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
                children={children}
                onReply={(parentId) => {
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
