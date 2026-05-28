import {
  ComponentParameter,
  ComponentProps,
  UniformText,
} from "@uniformdev/next-app-router/component";

import { PaginationControls } from "./paginationControls";

const PAGE_SIZE = 5;

// A stand-in for whatever "data source" you actually have (CMS query, search
// index, internal API, ...). What matters for the demo is that the *length*
// of what we render is driven by the `page` query string — so when `page`
// changes, the server-rendered output shifts to the new window, and items
// from other pages never cross the wire.
const TOTAL_ITEMS = 47;
const SOURCE_DATA = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: `item-${i + 1}`,
  title: `Item #${i + 1}`,
  description: `Server-rendered item ${i + 1} of ${TOTAL_ITEMS}.`,
}));

export type PaginatedListProps = {
  heading?: ComponentParameter<string>;
};

export const PaginatedList = ({
  parameters: { heading },
  context,
  component,
}: ComponentProps<PaginatedListProps>) => {
  // `page` is declared as an allowed query string on the project map node,
  // so middleware forwards it to the Route API, which exposes it as a
  // dynamic input. There's no client-side rendering of list items at all —
  // the user sees exactly one page worth of items, and that's all that
  // crosses the wire.
  const totalPages = Math.max(1, Math.ceil(SOURCE_DATA.length / PAGE_SIZE));
  const requested = Number(context.dynamicInputs?.page) || 1;
  const currentPage = Math.min(Math.max(1, requested), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = SOURCE_DATA.slice(start, end);

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
      <ul className="space-y-3">
        {visible.map((it) => (
          <li
            key={it.id}
            className="rounded border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="font-medium">{it.title}</div>
            <p className="text-sm text-neutral-600">{it.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-neutral-500">
        Items {start + 1}–{Math.min(end, SOURCE_DATA.length)} of{" "}
        {SOURCE_DATA.length}. Only this page is rendered server-side; the rest
        of the list never crosses the wire.
      </p>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
};
