"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={logout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>
            You&apos;re successfully logged in to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user?.displayName || user?.username}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
