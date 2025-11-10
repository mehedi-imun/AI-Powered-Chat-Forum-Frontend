"use client";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";
import NotificationDropdown from "@/components/NotificationDropdown";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <h1 className="text-lg md:text-xl font-semibold">
          <span className="hidden sm:inline">Admin Dashboard</span>
          <span className="sm:hidden">Admin</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-2 md:gap-3">
          {/* User info - hidden on small screens */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">
              {user?.displayName || user?.username}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>

          {/* Avatar for mobile */}
          <div className="md:hidden w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm">
            {user?.displayName?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase() ||
              "A"}
          </div>

          {/* Logout button */}
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
