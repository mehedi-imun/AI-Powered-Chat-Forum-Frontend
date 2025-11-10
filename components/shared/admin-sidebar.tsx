"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Flag,
  Settings,
  Home,
  FileText,
  Shield,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/use-app-selector";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Threads", href: "/admin/threads", icon: MessageSquare },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "AI Moderation", href: "/admin/moderation", icon: Shield },
  { name: "Reports", href: "/admin/reports", icon: Flag },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin", icon: Settings },
];

const externalLinks = [
  { name: "View Site", href: "/", icon: Home },
  { name: "Discussions", href: "/threads", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!sidebarOpen) return null;

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed lg:static inset-y-0 left-0 z-50 lg:z-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          {/* Close button for mobile */}
          <button
            onClick={handleClose}
            className="lg:hidden p-1 hover:bg-gray-800 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* External Links */}
        <div className="px-3 pb-6">
          <div className="border-t border-gray-700 pt-4 space-y-1">
            {externalLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
