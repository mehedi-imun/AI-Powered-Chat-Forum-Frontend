"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Eye, Lock, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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

interface ThreadsListProps {
  threads: Thread[];
}

export function ThreadsList({ threads }: ThreadsListProps) {
  if (threads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card
          key={thread._id}
          className="p-6 hover:shadow-md transition-shadow"
        >
          <Link href={`/threads/${thread._id}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {thread.isPinned && (
                    <Pin className="h-4 w-4 text-blue-600 shrink-0" />
                  )}
                  {thread.isLocked && (
                    <Lock className="h-4 w-4 text-gray-500 shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                    {thread.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="truncate">
                    by {thread.createdBy?.name || "Unknown"}
                  </span>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(thread.lastActivityAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {thread.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {thread.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{thread.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 shrink-0">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{thread.postCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{thread.viewCount || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
