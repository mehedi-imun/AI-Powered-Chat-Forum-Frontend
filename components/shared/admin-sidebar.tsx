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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                target="_blank"
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
  );
}
