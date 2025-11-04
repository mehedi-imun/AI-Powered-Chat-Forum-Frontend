import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, Eye, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMyThreadsAction } from "@/app/actions/thread.actions";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardThreadsPage() {
  const result = await getMyThreadsAction();

  const threads = result.success ? result.data?.threads || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Threads</h1>
          <p className="text-gray-600 mt-2">
            Manage all your discussion threads
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/threads/create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Thread
          </Link>
        </Button>
      </div>

      {!result.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {result.error}
        </div>
      )}

      {threads.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Thread List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No threads yet</p>
              <p className="text-sm mt-2 mb-4">
                Create your first thread to start a discussion
              </p>
              <Button asChild>
                <Link href="/dashboard/threads/create">
                  Create Your First Thread
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <Card key={thread._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/threads/${thread.slug}`}
                      className="text-xl font-semibold hover:text-blue-600 transition-colors"
                    >
                      {thread.title}
                    </Link>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {thread.content.substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(thread.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {thread.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {thread.postCount} replies
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          thread.status === "active"
                            ? "bg-green-100 text-green-700"
                            : thread.status === "locked"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {thread.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/threads/${thread._id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
