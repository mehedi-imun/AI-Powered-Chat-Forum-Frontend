import { Navbar } from "@/components/landing/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <div className=" flex items-center justify-center">{children}</div>
    </div>
  );
}
