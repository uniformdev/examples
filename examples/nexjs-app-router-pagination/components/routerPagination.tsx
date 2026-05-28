"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { PaginationControls } from "./paginationControls";

/**
 * Router-driven wrapper around `PaginationControls`. Used by the datasource
 * pagination demo where each Prev / Next click is a soft navigation that
 * re-renders the route segment server-side.
 *
 * Kept as its own client component so the surrounding server component
 * (`paginatedList.tsx`) doesn't have to be marked `"use client"`.
 */
export type RouterPaginationProps = {
  /** e.g. `/en/pagination-datasource` — the page number is appended. */
  basePath: string;
  /** 1-indexed. */
  currentPage: number;
  /** True if the current page is the last one. */
  isLastPage: boolean;
};

export const RouterPagination = ({
  basePath,
  currentPage,
  isLastPage,
}: RouterPaginationProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const goTo = (page: number) => {
    // Soft navigation: re-renders the route segment with the new offset
    // without a full document reload, and { scroll: false } keeps the user
    // where they are. `useTransition` keeps the current page visible while
    // the server works and exposes `pending` for the inline loading state.
    startTransition(() => {
      router.replace(`${basePath}/${page}`, { scroll: false });
    });
  };

  return (
    <PaginationControls
      hasPrev={currentPage > 1}
      hasNext={!isLastPage}
      onPrev={() => goTo(currentPage - 1)}
      onNext={() => goTo(currentPage + 1)}
      pending={pending}
    >
      Page {currentPage}
    </PaginationControls>
  );
};
