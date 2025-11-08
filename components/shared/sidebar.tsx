"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Bell,
  User,
  Settings,
  Shield,
  Users,
  FileText,
  BarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/use-app-selector";
import { UserRole } from "@/lib/redux/slices/authSlice";

// Regular user navigation
const userNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Home", href: "/", icon: Home },
  { name: "Threads", href: "/threads", icon: MessageSquare },
  { name: "My Threads", href: "/dashboard/my-threads", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]; // Admin navigation (includes thread management and admin tools)
const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  {
    name: "Thread Management",
    href: "/dashboard/threads",
    icon: MessageSquare,
  },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  if (!sidebarOpen) return null;

  // Determine navigation based on user role
  const isAdmin = user?.role === UserRole.ADMIN;
  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Chat Forum</h2>
        {isAdmin && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-medium">
            <Shield className="w-3 h-3" />
            Admin Panel
          </div>
        )}
      </div>
      <nav className="space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
