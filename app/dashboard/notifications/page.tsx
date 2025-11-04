"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  AtSign,
  Heart,
  UserPlus,
  Shield,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getCookie } from "@/lib/helpers/cookies";

interface Notification {
  _id: string;
  userId: string;
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
  relatedUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  relatedThread?: {
    _id: string;
    title: string;
    slug: string;
  };
  relatedPost?: {
    _id: string;
    content: string;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      let url = `${API_URL}/notifications?limit=50`;
      if (filter === "unread") {
        url += "&isRead=false";
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      const data: NotificationResponse = result.data;

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading("all");
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "PATCH",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAllRead = async () => {
    try {
      setActionLoading("delete-all");
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await fetch(`${API_URL}/notifications/read/all`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "mention":
        return <AtSign className={`${iconClass} text-blue-600`} />;
      case "reply":
        return <MessageSquare className={`${iconClass} text-green-600`} />;
      case "thread_comment":
        return <MessageSquare className={`${iconClass} text-purple-600`} />;
      case "post_like":
        return <Heart className={`${iconClass} text-red-600`} />;
      case "follow":
        return <UserPlus className={`${iconClass} text-indigo-600`} />;
      case "post_created":
        return <FileText className={`${iconClass} text-teal-600`} />;
      case "thread_created":
        return <MessageSquare className={`${iconClass} text-cyan-600`} />;
      case "ai_moderation_rejected":
        return <Shield className={`${iconClass} text-red-600`} />;
      case "ai_moderation_flagged":
        return <AlertTriangle className={`${iconClass} text-orange-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your latest notifications
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              disabled={actionLoading === "all"}
              className="gap-2"
            >
              {actionLoading === "all" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Mark All Read
            </Button>
          )}
          {notifications.some((n) => n.isRead) && (
            <Button
              onClick={deleteAllRead}
              variant="outline"
              size="sm"
              disabled={actionLoading === "delete-all"}
              className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              {actionLoading === "delete-all" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Clear Read
            </Button>
          )}
          <Button onClick={fetchNotifications} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            filter === "all"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            filter === "unread"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm mt-2">
                You&apos;ll see notifications when there&apos;s activity on your
                threads
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`transition-colors ${
                !notification.isRead
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full ${
                      !notification.isRead ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            !notification.isRead ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                            onClick={() => markAsRead(notification._id)}
                          >
                            View details →
                          </Link>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    {/* Related Info */}
                    {notification.relatedThread && (
                      <div className="mt-2 text-sm text-gray-500">
                        Thread:{" "}
                        <span className="font-medium">
                          {notification.relatedThread.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification._id)}
                        disabled={actionLoading === notification._id}
                        className="gap-1"
                      >
                        {actionLoading === notification._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification._id)}
                      disabled={actionLoading === notification._id}
                      className="gap-1 text-red-600 hover:bg-red-50"
                    >
                      {actionLoading === notification._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
