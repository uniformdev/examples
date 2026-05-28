"use client";

import {
  ComponentParameter,
  ComponentProps,
  getUniformSlot,
  UniformText,
} from "@uniformdev/next-app-router/component";
import { useState } from "react";

const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE_SIZE = 3;

export type PaginationContainerProps = {
  defaultOffset?: ComponentParameter<number>;
  /** Page size — how many items are visible at a time. */
  defaultLimit?: ComponentParameter<number>;
  /** Kept on the component definition for backwards compatibility, unused in page mode. */
  step?: ComponentParameter<number>;
  /** Label for the Next button. */
  loadMoreText?: ComponentParameter<string>;
};
export type PaginationContainerSlots = "cards";

export const PaginationContainer = ({
  parameters: { defaultOffset, defaultLimit, loadMoreText },
  slots,
  component,
}: ComponentProps<PaginationContainerProps, PaginationContainerSlots>) => {
  // Page index, held in client state. Prev/Next change the page; the
  // user only ever sees one page at a time.
  const [page, setPage] = useState(0);

  const offset = (defaultOffset?.value as number | undefined) ?? DEFAULT_OFFSET;
  const pageSize =
    (defaultLimit?.value as number | undefined) ?? DEFAULT_PAGE_SIZE;

  // All children of the `cards` slot are already rendered into RSC elements by
  // the SDK and arrive here as `slots.cards.items[].component`. Because this
  // component is a client component, every one of those elements has been
  // serialized into the RSC payload and shipped — paging here only controls
  // *what the user sees*, not what was downloaded. See README for the tradeoff
  // vs. the datasource approach.
  const allItems = getUniformSlot({ slot: slots.cards }) ?? [];
  const pageable = allItems.slice(offset);
  const totalPages = Math.max(1, Math.ceil(pageable.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);

  const start = clampedPage * pageSize;
  const end = start + pageSize;
  const visibleItems = pageable.slice(start, end);

  const hasPrev = clampedPage > 0;
  const hasNext = clampedPage < totalPages - 1;

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="grid gap-3">{visibleItems}</div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={!hasPrev}
          className="rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-40"
        >
          ← Previous
        </button>
        <p className="text-xs text-neutral-500">
          Page {clampedPage + 1} of {totalPages}
          <span className="block">
            Showing {visibleItems.length} of {allItems.length} (all already
            loaded)
          </span>
        </p>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={!hasNext}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
        >
          {loadMoreText ? (
            <UniformText
              component={component}
              parameter={loadMoreText}
              placeholder="Next →"
              as="span"
            />
          ) : (
            "Next →"
          )}
        </button>
      </div>
    </section>
  );
};
