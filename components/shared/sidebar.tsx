"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Bell, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppSelector } from "@/lib/hooks/use-app-selector";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Threads", href: "/dashboard/threads", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Chat Forum</h2>
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
