"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Bell, User, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/use-app-selector";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";

const userNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Home", href: "/", icon: Home },
  { name: "Threads", href: "/threads", icon: MessageSquare },
  { name: "My Threads", href: "/dashboard/my-threads", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!sidebarOpen) return null;

  const handleClose = () => {
     if (window.innerWidth < 1024) {
       dispatch(toggleSidebar());
     }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed lg:static inset-y-0 left-0 z-50 lg:z-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold">Chat Forum</h2>
          {/* Close button - শুধু mobile এ দেখাবে */}
          <button
            onClick={handleClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3">
          {userNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClose} // লিঙ্কে ক্লিক করলেও বন্ধ হবে
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
    </>
  );
}
