"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ModeratedPost {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  threadId: {
    _id: string;
    title: string;
  };
  moderationStatus: string;
  aiScore?: {
    spam?: number;
    toxicity?: number;
    inappropriate?: number;
    sentiment?: string;
  };
  createdAt: string;
  moderatedAt?: string;
}

export default function ModerationPage() {
  const [posts, setPosts] = useState<ModeratedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchModeratedPosts();
  }, [filter]);

  const fetchModeratedPosts = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = filter === "all" 
        ? `${API_URL}/admin/posts?limit=50`
        : `${API_URL}/admin/posts?moderationStatus=${filter}&limit=50`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      setPosts(result.data?.posts || []);
    } catch (error) {
      console.error("Failed to fetch moderated posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Rejected" },
      flagged: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle, text: "Flagged" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Eye, text: "Pending" },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-red-600";
    if (score >= 0.4) return "text-orange-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading moderated content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          AI Moderation
        </h1>
        <button
          type="button"
          onClick={fetchModeratedPosts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "flagged", label: "Flagged" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              No posts found for this filter.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="hover:border-blue-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(post.moderationStatus)}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-base">
                      Thread: <a href={`/threads/${post.threadId._id}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {post.threadId.title}
                      </a>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      By: <span className="font-medium">{post.author.name}</span> ({post.author.email})
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Post Content */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
                </div>

                {/* AI Scores */}
                {post.aiScore && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {post.aiScore.spam !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Spam</p>
                        <p className={`text-lg font-bold ${getScoreColor(post.aiScore.spam)}`}>
                          {(post.aiScore.spam * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.toxicity !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Toxicity</p>
                        <p className={`text-lg font-bold ${getScoreColor(post.aiScore.toxicity)}`}>
                          {(post.aiScore.toxicity * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.inappropriate !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Inappropriate</p>
                        <p className={`text-lg font-bold ${getScoreColor(post.aiScore.inappropriate)}`}>
                          {(post.aiScore.inappropriate * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.sentiment && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Sentiment</p>
                        <p className="text-sm font-bold capitalize">
                          {post.aiScore.sentiment === "positive" && "😊 Positive"}
                          {post.aiScore.sentiment === "neutral" && "😐 Neutral"}
                          {post.aiScore.sentiment === "negative" && "😞 Negative"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={`/threads/${post.threadId._id}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      View in Thread
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
