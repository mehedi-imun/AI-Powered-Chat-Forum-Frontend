"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { MessageSquare, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import NotificationDropdown from "@/app/components/NotificationDropdown";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>Chat Forum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/threads"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Discussions
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/threads/my-threads"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  My Threads
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <NotificationDropdown />
                  <span className="text-sm text-gray-600">
                    {user?.displayName || user?.username}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/threads"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discussions
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/threads/my-threads"
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Threads
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="text-sm text-gray-600 py-2">
                    Signed in as {user?.displayName || user?.username}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
