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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by proxy.ts middleware
  // No need to check here - middleware already protects admin routes

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
