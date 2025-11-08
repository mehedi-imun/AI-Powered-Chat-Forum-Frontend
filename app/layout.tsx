import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";
import SocketProvider from "@/components/providers/socket-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Chat Forum",
    default: "Chat Forum - AI-Powered Community Discussions",
  },
  description: "Join the conversation in our AI-powered chat forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
       
      >
        <ReduxProvider>
          <SocketProvider>{children}</SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
