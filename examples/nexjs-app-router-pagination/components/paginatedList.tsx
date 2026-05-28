import {
  ComponentParameter,
  ComponentProps,
  UniformText,
} from "@uniformdev/next-app-router/component";

import { LoadMore } from "./loadMore";

const DEFAULT_LIMIT = 5;
const STEP = 5;

// A stand-in for whatever "data source" you actually have (CMS query, search
// index, internal API, ...). What matters for the demo is that the *length*
// of what we render is driven by the `limit` query string — so when `limit`
// grows, the server-rendered output grows, and when it doesn't, the unrendered
// tail never crosses the wire.
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
  // `limit` is declared as an allowed query string on the project map node, so
  // the middleware forwards it to the Route API, the Route API exposes it as
  // a dynamic input, and the SDK lands it here on the server. There is no
  // client-side rendering of list items at all — only the visible window is
  // ever sent down.
  const limit = Math.max(
    1,
    Number(context.dynamicInputs?.limit) || DEFAULT_LIMIT,
  );
  const visible = SOURCE_DATA.slice(0, limit);
  const hasMore = SOURCE_DATA.length > limit;

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
        Showing {visible.length} of {SOURCE_DATA.length}. Each item is rendered
        server-side; only the visible window is sent to the client.
      </p>
      {hasMore ? <LoadMore currentLimit={limit} step={STEP} /> : null}
    </section>
  );
};
