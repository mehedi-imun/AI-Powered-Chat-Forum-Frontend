import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sidebar } from "@/app/components/shared/sidebar";
import { Header } from "@/app/components/shared/header";
import { getCurrentUserAction } from "@/app/actions/auth.actions";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and email is verified
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/login");
  }

  // If user is not email verified, redirect to verify-email page
  if (!user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(user.email)}`);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
