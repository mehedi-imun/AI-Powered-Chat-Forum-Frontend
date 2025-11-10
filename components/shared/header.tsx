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
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(toggleSidebar())}
        className="lg:block"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
            {user?.displayName?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase() ||
              "U"}
          </div>

          {/* Username - hidden on mobile */}
          <span className="hidden sm:inline-block text-sm font-medium">
            {user?.displayName || user?.username || "User"}
          </span>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
