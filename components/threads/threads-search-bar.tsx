"use client";

import { useState, useCallback, useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ThreadsSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();
  const lastSearchTime = useRef(0);
  const THROTTLE_DELAY = 1000; // Throttle: minimum 1 second between searches

  const handleSearch = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTime.current;

    // Throttling: prevent too frequent searches
    if (timeSinceLastSearch < THROTTLE_DELAY) {
      return;
    }

    lastSearchTime.current = now;

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/threads?${params.toString()}`, { scroll: false });
    });
  }, [search, searchParams, router]);

  const handleClear = useCallback(() => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    startTransition(() => {
      router.push(`/threads?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, router]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10"
          disabled={isPending}
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        disabled={isPending || !search.trim()}
        className="whitespace-nowrap"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
