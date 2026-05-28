"use client";

import {
  ComponentParameter,
  ComponentProps,
  getUniformSlot,
  UniformText,
} from "@uniformdev/next-app-router/component";
import { useState } from "react";

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 3;
const DEFAULT_STEP = 3;

export type PaginationContainerProps = {
  defaultOffset?: ComponentParameter<number>;
  defaultLimit?: ComponentParameter<number>;
  step?: ComponentParameter<number>;
  loadMoreText?: ComponentParameter<string>;
};
export type PaginationContainerSlots = "cards";

export const PaginationContainer = ({
  parameters: { defaultOffset, defaultLimit, step, loadMoreText },
  slots,
  component,
}: ComponentProps<PaginationContainerProps, PaginationContainerSlots>) => {
  // Client-side reveal state. No server round-trip on Load more.
  const [currentPage, setCurrentPage] = useState(0);

  const offset = (defaultOffset?.value as number | undefined) ?? DEFAULT_OFFSET;
  const initialLimit =
    (defaultLimit?.value as number | undefined) ?? DEFAULT_LIMIT;
  const stepValue = (step?.value as number | undefined) ?? DEFAULT_STEP;

  const currentLimit = initialLimit + currentPage * stepValue;
  const sliceEnd = offset + currentLimit;

  // All children of the `cards` slot are already rendered into RSC elements by
  // the SDK and arrive here as `slots.cards.items[].component`. Because this
  // component is a client component, every one of those elements has been
  // serialized into the RSC payload and shipped — slicing here is a *visual*
  // pagination, not a payload reduction. See README for the tradeoff vs. the
  // datasource approach.
  const allItems = getUniformSlot({ slot: slots.cards }) ?? [];
  const visibleItems = allItems.slice(offset, sliceEnd);
  const hasMoreItems = allItems.length > sliceEnd;

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="grid gap-3">{visibleItems}</div>
      <p className="mt-4 text-xs text-neutral-500">
        Showing {visibleItems.length} of {allItems.length}. All items are
        already in the page payload; Load more just reveals more of them.
      </p>
      {hasMoreItems ? (
        <button
          type="button"
          onClick={() => setCurrentPage((page) => page + 1)}
          className="mt-6 rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          {loadMoreText ? (
            <UniformText
              component={component}
              parameter={loadMoreText}
              placeholder="Load more"
              as="span"
            />
          ) : (
            "Load more"
          )}
        </button>
      ) : null}
    </section>
  );
};
