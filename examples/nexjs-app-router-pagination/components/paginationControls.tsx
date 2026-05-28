"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type PaginationControlsProps = {
  /** e.g. `/en/pagination-datasource` — the page number is appended. */
  basePath: string;
  /** 1-indexed. */
  currentPage: number;
  /** True if the current page is the last one (partial / empty slot). */
  isLastPage: boolean;
};

export const PaginationControls = ({
  basePath,
  currentPage,
  isLastPage,
}: PaginationControlsProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const goTo = (page: number) => {
    // Soft navigation:
    // - router.replace keeps history clean (one back leaves the page entirely
    //   instead of stepping through every page click)
    // - { scroll: false } keeps the user where they are
    // - useTransition keeps the current page visible while the server re-
    //   renders, and exposes `pending` for an inline loading state
    startTransition(() => {
      router.replace(`${basePath}/${page}`, { scroll: false });
    });
  };

  const hasPrev = currentPage > 1;
  const hasNext = !isLastPage;

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
        {pending ? "Loading…" : `Page ${currentPage}`}
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
