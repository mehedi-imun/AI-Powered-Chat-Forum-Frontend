"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  X,
  Check,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCookie } from "@/lib/helpers/cookies";

interface Notification {
  _id: string;
  type:
    | "mention"
    | "reply"
    | "thread_comment"
    | "post_like"
    | "follow"
    | "system"
    | "post_created"
    | "thread_created"
    | "ai_moderation_rejected"
    | "ai_moderation_flagged";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      let url = `${API_URL}/notifications?page=${page}&limit=${limit}`;
      if (filter !== "all") {
        url += `&isRead=${filter === "read"}`;
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      if (result.success) {
        setNotifications(result.data?.notifications || []);
        setUnreadCount(result.data?.unreadCount || 0);
        setTotal(result.data?.total || 0);
        setTotalPages(result.data?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, limit]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "PATCH",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        const wasUnread =
          notifications.find((n) => n._id === notificationId)?.isRead === false;
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const deleteAllRead = async () => {
    try {
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/notifications/read/all`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "post_created":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "thread_created":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "ai_moderation_rejected":
        return <X className="w-5 h-5 text-red-600" />;
      case "ai_moderation_flagged":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "mention":
        return <span className="text-lg">@</span>;
      case "reply":
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return "bg-white";

    switch (type) {
      case "ai_moderation_rejected":
        return "bg-red-50";
      case "ai_moderation_flagged":
        return "bg-orange-50";
      case "post_created":
        return "bg-green-50";
      case "thread_created":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  const handleFilterChange = (newFilter: "all" | "unread" | "read") => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your latest activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                className="gap-1"
              >
                <Filter className="h-4 w-4" />
                All ({total})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("unread")}
                className="gap-1"
              >
                <Bell className="h-4 w-4" />
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("read")}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Read ({total - unreadCount})
              </Button>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-1"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </Button>
              )}
              {notifications.some((n) => n.isRead) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteAllRead}
                  className="gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete read
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
              </p>
              <p className="text-sm mt-2">
                You&apos;ll see notifications when there&apos;s activity
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`transition-colors ${getNotificationBg(
                notification.type,
                notification.isRead
              )} ${!notification.isRead ? "border-l-4 border-l-blue-500" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      {notification.link ? (
                        <Link
                          href={notification.link}
                          className="font-medium hover:underline text-gray-900"
                          onClick={() => markAsRead(notification._id)}
                        >
                          {notification.title}
                        </Link>
                      ) : (
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                      )}
                      {!notification.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification._id)}
                            className="h-7 text-xs gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Mark read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notification._id)}
                          className="h-7 text-xs gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
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
            Showing {notifications.length} of {total} notifications (Page {page}{" "}
            of {totalPages})
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
