"use client";

import {
  ComponentParameter,
  ComponentProps,
  getUniformSlot,
  UniformText,
} from "@uniformdev/next-app-router/component";
import { useState } from "react";

import { PaginationControls } from "./paginationControls";

const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE_SIZE = 3;

export type PaginationContainerProps = {
  defaultOffset?: ComponentParameter<number>;
  /** Page size — how many items are visible at a time. */
  defaultLimit?: ComponentParameter<number>;
  previousLabel?: ComponentParameter<string>;
  nextLabel?: ComponentParameter<string>;
};
export type PaginationContainerSlots = "cards";

export const PaginationContainer = ({
  parameters: { defaultOffset, defaultLimit, previousLabel, nextLabel },
  slots,
  component,
}: ComponentProps<PaginationContainerProps, PaginationContainerSlots>) => {
  // Page index (0-based internally), held in client state. Prev / Next change
  // the page; the user only ever sees one page at a time.
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

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="grid gap-3">{visibleItems}</div>
      <PaginationControls
        hasPrev={clampedPage > 0}
        hasNext={clampedPage < totalPages - 1}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        previousLabel={
          previousLabel ? (
            <UniformText
              component={component}
              parameter={previousLabel}
              placeholder="← Previous"
              as="span"
            />
          ) : (
            "← Previous"
          )
        }
        nextLabel={
          nextLabel ? (
            <UniformText
              component={component}
              parameter={nextLabel}
              placeholder="Next →"
              as="span"
            />
          ) : (
            "Next →"
          )
        }
      >
        Page {clampedPage + 1} of {totalPages}
      </PaginationControls>
    </section>
  );
};
