"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
};

export const PaginationControls = ({
  currentPage,
  totalPages,
}: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const goTo = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));

    // Soft navigation:
    // - router.replace keeps the URL bookmarkable without polluting history
    //   (one back leaves the page entirely instead of stepping through every
    //   page click)
    // - { scroll: false } keeps the user where they are
    // - useTransition keeps the current page visible while the server re-
    //   renders the segment with the new `page` and exposes `pending` for
    //   an inline loading state
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={!hasPrev || pending}
        className="rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-40"
      >
        ← Previous
      </button>
      <p className="text-xs text-neutral-500">
        {pending ? "Loading…" : `Page ${currentPage} of ${totalPages}`}
      </p>
      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={!hasNext || pending}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
};
