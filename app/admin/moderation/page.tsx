"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCookie } from "@/lib/helpers/cookies";

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
  aiReasoning?: string;
  aiRecommendation?: string;
  createdAt: string;
  moderatedAt?: string;
}

interface AISummary {
  totalModerated: number;
  moderatedToday: number;
  moderatedThisWeek: number;
  breakdown: {
    approved: number;
    flagged: number;
    rejected: number;
    pending: number;
  };
  averageScores: {
    spam: number;
    toxicity: number;
    inappropriate: number;
  };
  highRiskCount: number;
}

export default function ModerationPage() {
  const [posts, setPosts] = useState<ModeratedPost[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchSummary = async () => {
    try {
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/admin/ai-moderation/summary`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      setSummary(result.data);
    } catch (error) {
      console.error("Failed to fetch AI summary:", error);
    }
  };

  const fetchModeratedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let url = `${API_URL}/admin/posts?page=${page}&limit=${limit}`;
      if (filter !== "all") {
        url += `&moderationStatus=${filter}`;
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      setPosts(result.data?.posts || []);
      setTotal(result.data?.total || 0);
      setTotalPages(result.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch moderated posts:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, page, limit]);

  useEffect(() => {
    fetchSummary();
    fetchModeratedPosts();
  }, [filter, fetchModeratedPosts]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to page 1 when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { color: string; icon: LucideIcon; text: string }
    > = {
      approved: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Rejected",
      },
      flagged: {
        color: "bg-orange-100 text-orange-800",
        icon: AlertTriangle,
        text: "Flagged",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Eye,
        text: "Pending",
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
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
          AI Moderation & Summary
        </h1>
        <button
          type="button"
          onClick={() => {
            fetchSummary();
            fetchModeratedPosts();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* AI Summary Stats */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Moderated
                </CardTitle>
                <Activity className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {summary.totalModerated}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  All time AI actions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Activity className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {summary.moderatedToday}
                </div>
                <p className="text-xs text-gray-600 mt-1">Posts moderated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Activity className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {summary.moderatedThisWeek}
                </div>
                <p className="text-xs text-gray-600 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {summary.highRiskCount}
                </div>
                <p className="text-xs text-gray-600 mt-1">Flagged posts</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {summary.breakdown.approved}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Flagged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {summary.breakdown.flagged}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {summary.breakdown.rejected}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4 text-yellow-600" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.breakdown.pending}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average AI Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Spam Detection</p>
                  <div className="text-2xl font-bold text-blue-600">
                    {(summary.averageScores.spam * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Toxicity</p>
                  <div className="text-2xl font-bold text-orange-600">
                    {(summary.averageScores.toxicity * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inappropriate</p>
                  <div className="text-2xl font-bold text-red-600">
                    {(summary.averageScores.inappropriate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

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
            onClick={() => handleFilterChange(tab.key)}
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
            <Card
              key={post._id}
              className="hover:border-blue-300 transition-colors"
            >
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
                      Thread:{" "}
                      {post.threadId ? (
                        <a
                          href={`/threads/${post.threadId._id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {post.threadId.title}
                        </a>
                      ) : (
                        <span className="text-gray-500">Deleted Thread</span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      By:{" "}
                      <span className="font-medium">
                        {post.author?.name || "Unknown User"}
                      </span>{" "}
                      {post.author?.email && `(${post.author.email})`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Post Content */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* AI Reasoning/Feedback */}
                {post.aiReasoning && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      AI Feedback:
                    </p>
                    <p className="text-sm text-blue-800">{post.aiReasoning}</p>
                    {post.aiRecommendation && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${
                          post.aiRecommendation === "approve"
                            ? "bg-green-100 text-green-800"
                            : post.aiRecommendation === "review"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        AI Recommendation: {post.aiRecommendation}
                      </span>
                    )}
                  </div>
                )}

                {/* AI Scores */}
                {post.aiScore && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {post.aiScore.spam !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Spam</p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            post.aiScore.spam
                          )}`}
                        >
                          {(post.aiScore.spam * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.toxicity !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Toxicity</p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            post.aiScore.toxicity
                          )}`}
                        >
                          {(post.aiScore.toxicity * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.inappropriate !== undefined && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">
                          Inappropriate
                        </p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(
                            post.aiScore.inappropriate
                          )}`}
                        >
                          {(post.aiScore.inappropriate * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {post.aiScore.sentiment && (
                      <div className="text-center p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 mb-1">Sentiment</p>
                        <p className="text-sm font-bold capitalize">
                          {post.aiScore.sentiment === "positive" &&
                            "😊 Positive"}
                          {post.aiScore.sentiment === "neutral" && "😐 Neutral"}
                          {post.aiScore.sentiment === "negative" &&
                            "😞 Negative"}
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
                  {post.threadId && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`/threads/${post.threadId._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View in Thread
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {posts.length} of {total} posts (Page {page} of {totalPages}
            )
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={page === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                // Show ellipsis
                if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
