"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  MessageCircle,
  Bell,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading";
import { formatRelativeTime } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants";

interface DashboardStats {
  totalPosts: number;
  totalThreads: number;
  unreadNotifications: number;
  profileViews: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalThreads: 0,
    unreadNotifications: 0,
    profileViews: 0,
  });
  const [loading, setLoading] = useState(true);

  const displayName =
    user?.displayName || user?.username || user?.email?.split("@")[0] || "User";

  // Redirect admin/moderator users to admin dashboard
  useEffect(() => {
    if (user?.role === "Admin" || user?.role === "Moderator") {
      router.push(ROUTES.ADMIN);
    }
  }, [user, router]);

  // Fetch dashboard stats
  useEffect(() => {
    // Simulate API call - replace with actual API when available
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/v1/users/me/stats');
        // const data = await response.json();

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStats({
          totalPosts: 0,
          totalThreads: 0,
          unreadNotifications: 0,
          profileViews: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${displayName}! 👋`}
        description="Here's what's happening with your account today."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          description="Comments made"
          icon={MessageCircle}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Threads"
          value={stats.totalThreads}
          description="Participating in"
          icon={MessageSquare}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Unread Notifications"
          value={stats.unreadNotifications}
          description="New activity"
          icon={Bell}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Profile Views"
          value={stats.profileViews}
          description="Last 30 days"
          icon={Eye}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalPosts === 0 && stats.totalThreads === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm mt-1">
                  Start by creating a thread or replying to one!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">
                      New reply on your thread
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(new Date())}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">
                      User started following you
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(
                        new Date(Date.now() - 5 * 60 * 60 * 1000)
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">
                      Your thread was featured
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href={ROUTES.THREADS}
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-blue-900">Browse Threads</p>
                <p className="text-sm text-blue-600">
                  Explore active discussions
                </p>
              </Link>
              <Link
                href={ROUTES.DASHBOARD_NOTIFICATIONS}
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">View Notifications</p>
                <p className="text-sm text-gray-600">Check your updates</p>
              </Link>
              <Link
                href={ROUTES.DASHBOARD_PROFILE}
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </Link>
              <Link
                href={ROUTES.DASHBOARD_SETTINGS}
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Manage your account</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
