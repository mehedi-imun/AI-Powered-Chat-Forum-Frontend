"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";
import { useAuth } from "@/lib/hooks/use-auth";
import NotificationDropdown from "@/components/NotificationDropdown";

export function Header() {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(toggleSidebar())}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {user?.displayName?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase() ||
              "U"}
          </div>
          <span className="text-sm font-medium">
            {user?.displayName || user?.username || "User"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
