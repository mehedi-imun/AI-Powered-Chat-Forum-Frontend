"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, MessageCircle, Bell, Eye } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.username || "User";

  const stats = [
    {
      title: "Total Posts",
      value: "48",
      icon: MessageCircle,
      description: "Comments made",
      bgColor: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Active Threads",
      value: "12",
      icon: MessageSquare,
      description: "Participating in",
      bgColor: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Unread Notifications",
      value: "5",
      icon: Bell,
      description: "New activity",
      bgColor: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Profile Views",
      value: "234",
      icon: Eye,
      description: "Last 30 days",
      bgColor: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {displayName}! 👋</h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">
                    New reply on your thread
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">
                    User started following you
                  </p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">
                    Your thread was featured
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/threads"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-blue-900">Browse Threads</p>
                <p className="text-sm text-blue-600">
                  Explore active discussions
                </p>
              </Link>
              <Link
                href="/dashboard/notifications"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">View Notifications</p>
                <p className="text-sm text-gray-600">Check your updates</p>
              </Link>
              <Link
                href="/dashboard/profile"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
