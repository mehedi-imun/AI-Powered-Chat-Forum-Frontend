"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getCookie } from "@/lib/helpers/cookies";

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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = getCookie("accessToken");

      const [usersRes, threadsRes, postsRes] = await Promise.all([
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

      const [usersData, threadsData, postsData] = await Promise.all([
        usersRes.json(),
        threadsRes.json(),
        postsRes.json(),
      ]);

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
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <button
          type="button"
          onClick={fetchAnalytics}
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
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalUsers || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {analytics?.activeUsers || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <MessageSquare className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalThreads || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Community discussions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalPosts || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              All replies and comments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalPosts && analytics?.totalThreads
                ? (analytics.totalPosts / analytics.totalThreads).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-gray-600 mt-1">Avg posts per thread</p>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Moderation Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Activity className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {analytics?.pendingModeration || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {analytics?.approvedPosts || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">AI approved posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {analytics?.rejectedPosts || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">AI rejected posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {analytics?.flaggedPosts || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </a>

            <a
              href="/admin/moderation"
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              <AlertTriangle className="h-6 w-6 text-orange-600 mb-2" />
              <h3 className="font-semibold mb-1">AI Moderation</h3>
              <p className="text-sm text-gray-600">Review flagged content</p>
            </a>

            <a
              href="/admin/threads"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-semibold mb-1">Manage Threads</h3>
              <p className="text-sm text-gray-600">View all discussions</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
