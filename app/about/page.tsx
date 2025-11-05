import { Metadata } from "next";
import { Navbar } from "@/app/components/landing/navbar";
import { Footer } from "@/app/components/landing/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { MessageSquare, Users, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Chat Forum",
  description:
    "Learn more about Chat Forum - a modern, AI-powered discussion platform",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            About Chat Forum
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            A modern discussion platform built for meaningful conversations
          </p>

          <div className="prose max-w-none mb-12">
            <Card>
              <CardContent className="py-8">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  Chat Forum is designed to foster meaningful conversations and
                  community building through technology. We believe that great
                  discussions lead to better ideas, stronger connections, and
                  positive change.
                </p>
                <p className="text-gray-700">
                  Built with modern web technologies including Next.js 16,
                  TypeScript, and powered by AI moderation, we provide a safe,
                  fast, and engaging platform for communities to thrive.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rich Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create threaded conversations with markdown support, code
                  highlighting, and real-time updates for seamless
                  communication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with like-minded individuals, build relationships, and
                  grow your network through authentic interactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Safe & Moderated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered moderation keeps discussions respectful and
                  on-topic, creating a welcoming environment for all users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built on Next.js 16 with Server Components and Turbopack for
                  optimal performance and developer experience.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of users already having meaningful conversations
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/register"
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Create Free Account
                </a>
                <a
                  href="/threads"
                  className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Browse Discussions
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
