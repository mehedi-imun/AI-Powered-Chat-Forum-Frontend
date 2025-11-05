"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import NotificationDropdown from "@/components/NotificationDropdown";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.displayName || user?.username}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
