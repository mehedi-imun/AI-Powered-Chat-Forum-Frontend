import Link from "next/link";
import { Navbar } from "@/app/components/landing/navbar";
import { Footer } from "@/app/components/landing/footer";
import { Button } from "@/app/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <FileQuestion className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/threads">Browse Discussions</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
