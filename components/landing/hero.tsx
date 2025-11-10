"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-500/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* --- Heading --- */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Join the Conversation,
            <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              Connect with Community
            </span>
          </h1>

          {/* --- Subtext --- */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            A modern forum platform powered by AI. Share ideas, ask questions,
            and engage in meaningful discussions with thousands of users.
          </p>

          {/* --- Buttons --- */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {/* Keep Get Started same height as gradient button */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg
                         bg-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            {/* Glossy Gradient Button */}
            <Link
              href="/threads"
              className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg overflow-hidden
                         text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-md transition-all duration-300
                         hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-40 blur-sm animate-pulse"></span>
              <span className="relative z-10 flex items-center gap-2">
                Browse Discussions
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

          {/* --- Features --- */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Rich Discussions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create and participate in threaded conversations with markdown
                support and real-time updates.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Active Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connect with like-minded individuals and build meaningful
                relationships through shared interests.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
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
