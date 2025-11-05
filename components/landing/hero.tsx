import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Join the Conversation,
            <br />
            <span className="text-primary">Connect with Community</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern forum platform powered by AI. Share ideas, ask questions,
            and engage in meaningful discussions with thousands of users.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/threads">Browse Discussions</Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Rich Discussions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create and participate in threaded conversations with markdown
                support and real-time updates.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Active Community</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connect with like-minded individuals and build meaningful
                relationships through shared interests.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                AI-Powered Moderation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Advanced AI helps maintain quality discussions and keep the
                community safe and welcoming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
