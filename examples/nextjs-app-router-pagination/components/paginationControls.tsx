"use client";

import { ReactNode } from "react";

/**
 * Dumb, presentational Prev / Next controls.
 *
 * Used by both pagination demos. The two callers wire `onPrev` / `onNext` to
 * different state mechanisms — `useRouter().replace(...)` for the datasource
 * approach (see `routerPagination.tsx`), `useState` for the slot approach
 * (see `paginationContainer.tsx`) — but the controls themselves are
 * identical, and the button labels come from Uniform component parameters
 * (so authors can localise / change them without touching code).
 */
export type PaginationControlsProps = {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Content of the Previous button — typically `<UniformText ... />`. */
  previousLabel: ReactNode;
  /** Content of the Next button — typically `<UniformText ... />`. */
  nextLabel: ReactNode;
  /** Disable both buttons and replace the indicator with "Loading…". */
  pending?: boolean;
  /** Indicator content between the two buttons (e.g. `Page 2` or `Page 2 of 5`). */
  children?: ReactNode;
};

export const PaginationControls = ({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  previousLabel,
  nextLabel,
  pending = false,
  children,
}: PaginationControlsProps) => {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev || pending}
        className="rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-40"
      >
        {previousLabel}
      </button>
      <p className="text-xs text-neutral-500">
        {pending ? "Loading…" : children}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext || pending}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
};
