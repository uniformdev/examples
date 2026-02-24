"use client";

import { useQuerySummary, useSearchBox, useSort } from "@/lib/coveo/engine-definition";
import { SortBy, SortCriterion, SortOrder } from "@coveo/headless";

const sortOptions: Array<{ label: string; criterion: SortCriterion }> = [
  {
    label: 'Date ↓',
    criterion: { by: SortBy.Date, order: SortOrder.Descending },
  },
  {
    label: 'Date ↑',
    criterion: { by: SortBy.Date, order: SortOrder.Ascending },
  },
  { label: 'Relevancy', criterion: { by: SortBy.Relevancy } },
];

export function SearchToolbar() {
  const { state: querySummaryState } = useQuerySummary();
  const { state: searchBoxState } = useSearchBox();
  const { methods: sortMethods } = useSort();

  const sort = useSort();

  const searchQuery = searchBoxState.value || '';
  const totalCount = querySummaryState?.total || 0;

  const handleSortClick = (label: string) => {
    const criterion = sortOptions.find(c => c.label === label)?.criterion;
    if (criterion && sortMethods) {
      sortMethods.sortBy(criterion);
    }
  };

  return (
    <div>
      <p>
        {totalCount} {totalCount === 1 ? "result" : "results"} for "{searchQuery}"
      </p>
      {sortOptions.length > 0 && (
        <div>
          <label htmlFor="sort">
            Sort:
          </label>
          <select
            id="sort"
            onChange={(e) => handleSortClick(e.target.value)}
          >
            {sortOptions.map((criterion) => (
              <option key={criterion.label} value={criterion.label}>
                {criterion.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
