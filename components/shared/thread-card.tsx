import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, User, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  thread: {
    _id: string;
    title: string;
    content: string;
    author: {
      username: string;
      displayName: string;
    };
    replyCount: number;
    createdAt: string;
  };
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link
            href={`/threads/${thread._id}`}
            className="hover:text-primary transition-colors"
          >
            {thread.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{thread.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{thread.author.displayName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{thread.replyCount} replies</span>
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

          <Link
            href={`/threads/${thread._id}`}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
