"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { Flag, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCookie } from "@/lib/helpers/cookies";

interface Report {
  _id: string;
  reportType: string;
  description: string;
  reportedContentType: string;
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let url = `${API_URL}/admin/reports?page=${page}&limit=${limit}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;

      const response = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      setReports(result.data?.reports || []);
      setTotal(result.data?.total || 0);
      setTotalPages(result.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setPage(1); // Reset to page 1 when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      dismissed: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getReportTypeBadge = (type: string) => {
    const styles = {
      spam: "bg-orange-100 text-orange-800",
      harassment: "bg-red-100 text-red-800",
      inappropriate: "bg-purple-100 text-purple-800",
      "off-topic": "bg-blue-100 text-blue-800",
      other: "bg-gray-100 text-gray-800",
    };
    return styles[type as keyof typeof styles] || styles.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Flag className="h-8 w-8 text-orange-600" />
          Reports Management
        </h1>
        <button
          type="button"
          onClick={fetchReports}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              No reports found.
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card
              key={report._id}
              className="hover:border-blue-300 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReportTypeBadge(
                          report.reportType
                        )}`}
                      >
                        {report.reportType}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {report.reportedContentType}
                      </span>
                    </div>
                    <CardTitle className="text-base mb-1">
                      Reported by: {report.reportedBy?.name || "Unknown User"}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {report.reportedBy?.email || "No email"} •{" "}
                      {formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Description:
                  </p>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50 gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Dismiss
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View Details
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
            Showing {reports.length} of {total} reports (Page {page} of{" "}
            {totalPages})
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
