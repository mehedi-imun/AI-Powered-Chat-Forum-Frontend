"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  MessageSquare,
  Search,
  Pin,
  Lock,
  Trash2,
  Eye,
  PinOff,
  LockOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getCookie } from "@/lib/helpers/cookies";

interface Thread {
  _id: string;
  title: string;
  content: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string;
}

export default function ThreadsManagementPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let url = `${API_URL}/admin/threads?page=${page}&limit=${limit}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (searchTerm) url += `&searchTerm=${searchTerm}`;

      const response = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      setThreads(result.data?.threads || []);
      setTotal(result.data?.total || 0);
      setTotalPages(result.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, page, limit]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
    fetchThreads();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading threads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          Threads Management
        </h1>
        <button
          type="button"
          onClick={fetchThreads}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Search threads by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              No threads found.
            </CardContent>
          </Card>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread._id}
              className="hover:border-blue-300 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                      {thread.isLocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          thread.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {thread.status}
                      </span>
                    </div>
                    <CardTitle className="text-base mb-1">
                      <Link
                        href={`/threads/${thread._id}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {thread.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      By:{" "}
                      <span className="font-medium">
                        {thread.createdBy?.name || "Unknown User"}
                      </span>{" "}
                      •{" "}
                      {formatDistanceToNow(new Date(thread.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {thread.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {thread.replyCount} replies
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {thread.content}
                </p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    {thread.isPinned ? (
                      <>
                        <PinOff className="h-3 w-3" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-3 w-3" />
                        Pin
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    {thread.isLocked ? (
                      <>
                        <LockOpen className="h-3 w-3" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Lock
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link
                      href={`/threads/${thread._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
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
            Showing {threads.length} of {total} threads (Page {page} of{" "}
            {totalPages})
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
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
