"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { CreateThreadModal } from "./create-thread-modal";

export function StartDiscussionButton() {
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login link
  if (!isAuthenticated) {
    return (
      <Button asChild>
        <Link href="/login">Start Discussion</Link>
      </Button>
    );
  }

  // If authenticated, show modal
  return <CreateThreadModal />;
}
