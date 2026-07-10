"use client";

import { useEffect, useState } from "react";
import { Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueueHealthAction } from "@/app/actions/admin.actions";
import { cn } from "@/lib/utils";

interface QueueHealth {
  pendingModeration: number;
  failedJobs: number;
}

export function QueueHealthCard() {
  const [health, setHealth] = useState<QueueHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    const result = await getQueueHealthAction();
    if (result.success && result.data) {
      setHealth({
        pendingModeration: result.data.pendingModeration,
        failedJobs: result.data.failedJobs,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-24 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
          <Eye className="h-5 w-5 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-3xl font-bold", "text-yellow-600")}>
            {health?.pendingModeration ?? 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Posts awaiting AI review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Queue Jobs</CardTitle>
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-3xl font-bold", "text-red-600")}>
            {health?.failedJobs ?? 0}
          </div>
          {(health?.failedJobs ?? 0) > 0 ? (
            <p className="text-xs text-red-500 mt-1 font-medium">Needs replay</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">No failed jobs</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
