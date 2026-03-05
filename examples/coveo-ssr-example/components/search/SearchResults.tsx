"use client";

import {
  type ComponentProps,
  registerUniformComponent,
  UniformText,
} from "@uniformdev/canvas-react";
import { usePager, useResultList } from "@/lib/coveo/engine-definition";
import { SearchResultItem } from "./SearchResultItem";

type SearchResultsParameters = {
  noResultsText?: string;
};

export function SearchResults({
  component,
}: ComponentProps<SearchResultsParameters> = {} as ComponentProps<SearchResultsParameters>) {
  const { state: resultListState } = useResultList();
  const pager = usePager();

  const results = resultListState.results ?? [];
  const hasResults = results.length > 0;

  return (
    <div>
      {!hasResults && (
        <p className="text-sm text-gray-500">
          {component ? (
            <UniformText
              parameterId="noResultsText"
              placeholder="Text when there are no search results"
            />
          ) : null}
        </p>
      )}
      {hasResults && (
        <ul className="divide-y divide-gray-100">
          {results.map((result) => (
            <li key={result.uniqueId}>
              <SearchResultItem result={result} />
            </li>
          ))}
        </ul>
      )}
      {hasResults && pager.state && pager.state.maxPage > 1 && (
        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            disabled={pager.state.currentPage <= 1}
            onClick={() => pager.methods?.previousPage()}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pager.state.currentPage} of {pager.state.maxPage}
          </span>
          <button
            type="button"
            disabled={pager.state.currentPage >= pager.state.maxPage}
            onClick={() => pager.methods?.nextPage()}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

registerUniformComponent({
  type: "searchResults",
  component: SearchResults,
});
