"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  AlertTriangle,
  FileText,
  Shield,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { getCookie } from "@/lib/helpers/cookies";

interface DashboardStats {
  totalUsers: number;
  totalThreads: number;
  totalPosts: number;
  totalReports: number;
  activeUsers: number;
  newUsersToday: number;
  newThreadsToday: number;
  newPostsToday: number;
  pendingReports: number;
  bannedUsers: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalThreads: number;
  totalPosts: number;
  activeUsers: number;
  pendingModeration: number;
  approvedPosts: number;
  rejectedPosts: number;
  flaggedPosts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = getCookie("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // Fetch dashboard stats and analytics in parallel
      const [dashboardRes, usersRes, threadsRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch(`${API_URL}/admin/users/stats`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch(`${API_URL}/admin/threads/stats`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch(`${API_URL}/admin/posts/stats`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      const [dashboardData, usersData, threadsData, postsData] = await Promise.all([
        dashboardRes.json(),
        usersRes.json(),
        threadsRes.json(),
        postsRes.json(),
      ]);

      setStats(dashboardData.data);
      setAnalytics({
        totalUsers: usersData.data?.total || 0,
        totalThreads: threadsData.data?.total || 0,
        totalPosts: postsData.data?.total || 0,
        activeUsers: usersData.data?.active || 0,
        pendingModeration: postsData.data?.moderation?.pending || 0,
        approvedPosts: postsData.data?.moderation?.approved || 0,
        rejectedPosts: postsData.data?.moderation?.rejected || 0,
        flaggedPosts: postsData.data?.moderation?.flagged || 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard & Analytics</h1>
        <button
          type="button"
          onClick={fetchAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeUsers || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalThreads || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newThreadsToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newPostsToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingReports || 0} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users Today
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats?.newUsersToday || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Threads Today
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              +{stats?.newThreadsToday || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Posts Today
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              +{stats?.newPostsToday || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Moderation Stats */}
      {analytics && (
        <>
          <h2 className="text-2xl font-bold">AI Moderation Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Moderation
                </CardTitle>
                <Activity className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {analytics.pendingModeration}
                </div>
                <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Shield className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.approvedPosts}
                </div>
                <p className="text-xs text-gray-600 mt-1">AI approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {analytics.rejectedPosts}
                </div>
                <p className="text-xs text-gray-600 mt-1">AI rejected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {analytics.flaggedPosts}
                </div>
                <p className="text-xs text-gray-600 mt-1">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <h2 className="text-2xl font-bold">Platform Engagement</h2>
          <Card>
            <CardHeader>
              <CardTitle>Engagement Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {analytics.totalPosts && analytics.totalThreads
                  ? (analytics.totalPosts / analytics.totalThreads).toFixed(1)
                  : "0"}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Average posts per thread - Higher is better
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/moderation">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                AI Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Review moderated content
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                View and manage users
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reports">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                View admin activity logs
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
