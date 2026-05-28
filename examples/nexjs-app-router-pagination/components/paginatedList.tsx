import {
  ComponentParameter,
  ComponentProps,
  UniformSlot,
  UniformText,
} from "@uniformdev/next-app-router/component";

import { offsetToPage, PAGE_SIZE } from "../lib/paginationDatasource";
import { PaginationControls } from "./paginationControls";

export type PaginatedListProps = {
  heading?: ComponentParameter<string>;
};
export type PaginatedListSlots = "cards";

export const PaginatedList = ({
  parameters: { heading },
  slots,
  context,
  component,
}: ComponentProps<PaginatedListProps, PaginatedListSlots>) => {
  // The Uniform Route API resolved the data resource using the `:offset`
  // dynamic input the middleware put there. `slots.cards` contains exactly the
  // 5-item window for this page — no client-side slicing, no hardcoded data.
  const offset = Math.max(0, Number(context.dynamicInputs?.offset) || 0);
  const currentPage = offsetToPage(offset);
  const locale = context.dynamicInputs?.locale ?? "en";

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      {heading ? (
        <UniformText
          component={component}
          parameter={heading}
          placeholder="Datasource pagination demo"
          as="h1"
          className="mb-6 text-3xl font-semibold tracking-tight"
        />
      ) : null}

      <div className="space-y-3">
        <UniformSlot slot={slots.cards} />
      </div>

      <PaginationControls
        basePath={`/${locale}/pagination-datasource`}
        currentPage={currentPage}
        // We don't know the total page count from the slot alone, but a partial
        // page (fewer than PAGE_SIZE items) is unambiguously the last page.
        isLastPage={(slots.cards?.items.length ?? 0) < PAGE_SIZE}
      />
    </section>
  );
};
