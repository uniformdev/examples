"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export type LoadMoreProps = {
  currentLimit: number;
  step: number;
};

export const LoadMore = ({ currentLimit, step }: LoadMoreProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const next = new URLSearchParams(searchParams);
    next.set("limit", String(currentLimit + step));

    // Soft navigation:
    // - router.replace updates the URL without pushing history (back doesn't
    //   step through every page size — one back leaves the page entirely)
    // - { scroll: false } keeps the user where they are instead of jumping to
    //   the top
    // - useTransition keeps the existing list visible while the server re-
    //   renders the segment with the new `limit`, and exposes `pending` for an
    //   inline loading state
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="mt-6 rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Loading…" : "Load more"}
    </button>
  );
};
