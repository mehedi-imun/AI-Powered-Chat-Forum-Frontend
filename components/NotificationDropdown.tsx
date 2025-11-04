"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  AtSign,
  Heart,
  UserPlus,
  Shield,
  AlertTriangle,
  FileText,
  Check,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  isRead: boolean;
  createdAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/notifications?limit=5`, {
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
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
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
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "w-4 h-4";
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {unreadCount} new
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      !notification.isRead ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>

                    <div className="flex gap-2 mt-2">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => {
                            markAsRead(notification._id);
                            setIsOpen(false);
                          }}
                        >
                          View
                        </Link>
                      )}
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification._id)}
                          className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-3 border-t">
          <Link
            href="/dashboard/notifications"
            className="text-sm text-blue-600 hover:underline font-medium block text-center"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
