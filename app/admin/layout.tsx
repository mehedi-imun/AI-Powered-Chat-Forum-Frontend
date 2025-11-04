import { Metadata } from "next";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminHeader } from "@/components/shared/admin-header";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: {
    template: "%s | Admin Dashboard",
    default: "Admin Dashboard",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
