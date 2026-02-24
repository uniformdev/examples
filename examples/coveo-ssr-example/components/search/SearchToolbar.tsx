"use client";

import { useQuerySummary, useSort } from "@/lib/coveo/engine-definition";

export function SearchToolbar() {
  const summary = useQuerySummary();
  const sort = useSort();

  const totalCount =
    "totalCount" in summary.state
      ? (summary.state as { totalCount?: number }).totalCount ?? 0
      : 0;
  const sortCriteria = sort.state.sortCriteria;
  const sortOptions = Array.isArray(sortCriteria) ? sortCriteria : [];
  const currentExpression =
    Array.isArray(sortCriteria) && sortCriteria.length > 0
      ? sortCriteria[0].expression
      : "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
      <p className="text-sm text-gray-600">
        {totalCount} {totalCount === 1 ? "result" : "results"}
      </p>
      {sortOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort:
          </label>
          <select
            id="sort"
            value={currentExpression}
            onChange={(e) => {
              const criterion = sortOptions.find(
                (c) => c.expression === e.target.value
              );
              if (criterion) sort.methods?.sortBy(criterion);
            }}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          >
            {sortOptions.map((criterion) => (
              <option key={criterion.expression} value={criterion.expression}>
                {criterion.expression}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
