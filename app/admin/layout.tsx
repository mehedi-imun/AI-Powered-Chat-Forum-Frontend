import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminHeader } from "@/components/shared/admin-header";
import { getCurrentUserAction } from "@/app/actions/auth.actions";

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
  // Check if user is authenticated and is admin
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin
  if (user.role.toLowerCase() !== "admin") {
    redirect("/dashboard");
  }

  // If user is not email verified, redirect to verify-email page
  if (!user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(user.email)}`);
  }

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
