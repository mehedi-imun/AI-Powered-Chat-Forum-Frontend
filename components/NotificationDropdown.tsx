"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCookie } from "@/lib/helpers/cookies";
import { useSocket } from "@/components/providers/socket-provider";

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

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { socket, isConnected } = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasFetchedInitial = useRef(false);

  // Initialize notification sound (simple beep sound)
  useEffect(() => {
    // Using Web Audio API for a simple notification beep
    audioRef.current = null; // We'll use Web Audio API instead
  }, []);

  const playNotificationSound = () => {
    try {
      // Create a simple beep using Web Audio API
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = "sine"; // Sine wave for a pleasant tone

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      console.log("Failed to play notification sound:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/notifications?limit=10`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      if (result.success) {
        setNotifications(result.data?.notifications || []);
        setUnreadCount(result.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

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
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );
        const wasUnread =
          notifications.find((n) => n._id === notificationId)?.isRead === false;
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Real-time notification listener
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⏳ Socket not connected or not available");
      return;
    }

    console.log("🔔 Setting up real-time notification listener");
    console.log("📡 Socket ID:", socket.id);
    console.log("🔗 Socket connected:", isConnected);

    // Listen for new notifications (backend emits "notification:new")
    socket.on(
      "notification:new",
      (data: { notification: Notification; timestamp?: Date }) => {
        console.log("📬 Received new notification:", data);
        console.log("🔊 Playing notification sound...");

        if (data.notification) {
          // Add new notification to the list
          setNotifications((prev) => [data.notification, ...prev]);

          // Increment unread count
          setUnreadCount((prev) => prev + 1);

          // Play notification sound
          playNotificationSound();
        }
      }
    );

    // Listen for notification updates (mark as read)
    socket.on("notification:read", (data: { notificationId: string }) => {
      console.log("✓ Notification marked as read:", data);

      if (data.notificationId) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === data.notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up notification listeners");
      socket.off("notification:new");
      socket.off("notification:read");
    };
  }, [socket, isConnected]);

  // Fetch unread count on mount (lightweight)
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getCookie("accessToken");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_URL}/notifications/unread-count`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const result = await response.json();
        if (result.success) {
          setUnreadCount(result.data?.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    if (!hasFetchedInitial.current) {
      fetchUnreadCount();
      hasFetchedInitial.current = true;
    }
  }, []);

  // Fetch full notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "post_created":
        return <Bell className={iconClass} />;
      case "thread_created":
        return <Bell className={iconClass} />;
      case "ai_moderation_rejected":
        return <X className="w-4 h-4 text-red-500" />;
      case "ai_moderation_flagged":
        return <Bell className="w-4 h-4 text-orange-500" />;
      case "mention":
        return <span className={iconClass}>@</span>;
      case "reply":
        return <span className={iconClass}>💬</span>;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ai_moderation_rejected":
        return "bg-red-50 border-red-200";
      case "ai_moderation_flagged":
        return "bg-orange-50 border-orange-200";
      case "post_created":
        return "bg-green-50 border-green-200";
      case "thread_created":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px]">
        <div className="flex items-center justify-between px-2 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs gap-1"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`relative p-3 hover:bg-gray-50 transition-colors border-l-4 ${
                    notification.isRead
                      ? "border-l-transparent"
                      : "border-l-blue-500"
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        {notification.link ? (
                          <Link
                            href={notification.link}
                            className="text-sm font-medium hover:underline"
                            onClick={() => {
                              markAsRead(notification._id);
                              setOpen(false);
                            }}
                          >
                            {notification.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification._id)}
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification._id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/notifications"
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
