"use client";

import { useAuthorFacet } from "@/lib/coveo/engine-definition";

export function SearchFacets() {
  const authorFacet = useAuthorFacet();
  const values = authorFacet.state.values ?? [];

  return (
    <div className="space-y-4">
      {values.length > 0 && (
        <fieldset className="rounded border border-gray-200 p-3">
          <legend className="text-sm font-medium text-gray-700">Author</legend>
          <ul className="mt-2 space-y-1">
            {values.map((value) => (
              <li key={value.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value.state === "selected"}
                    onChange={() => authorFacet.methods?.toggleSelect(value)}
                    className="rounded"
                  />
                  <span>
                    {value.value} ({value.numberOfResults})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </div>
  );
}
