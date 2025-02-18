"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { ComponentProps } from "@uniformdev/canvas-next-rsc/component";

import {
  Facets,
  SearchResult,
  SearchResultsWithPagination,
} from "@/types/search";
import SearchInput from "./SearchInput";
import { Facet } from "./FilterPanel";

const SearchResultCard = lazy(() => import("./SearchResultCard"));
const FilterPanel = lazy(() => import("./FilterPanel"));

export const SearchContainer = ({
  selectedFacets = [],
}: ComponentProps<SearchComponentProps, SearchComponentSlots>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [facets, setFacets] = useState<Facets>({});
  const [filterDefs, setFilterDefs] = useState<
    { filterName: string; filterField: string }[]
  >([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const optionsArray = selectedFacets
          .map((pair) => pair.trim())
          .filter(Boolean);

        // For each comma-separated pair, we get:
        //  e.g. "Category:category.name" -> { filterName: "Category", filterField: "fields.category.name" }
        const pairs = optionsArray.map((item) => {
          const [filterName, filterField] = item
            .split(":")
            .map((s) => s.trim());
          return { filterName, filterField: "fields." + filterName };
        });

        //save pairs for FilterPanel
        setFilterDefs(pairs);
        // Build the facetBy string
        // e.g. "fields.category.name,fields.tags.name"
        const facetByParams = pairs.map((p) => `${p.filterField}`).join(",");

        const response = await fetch(
          `/api/search?search=${encodeURIComponent(
            searchTerm
          )}&filters=${encodeURIComponent(
            JSON.stringify(filters)
          )}&facetBy=${facetByParams}`
        );
        const data: SearchResultsWithPagination = await response.json();
        setSearchResults(data.items);

        // Store initial facets only once
        if (!Object.keys(facets).length) {
          setFacets(data.facets);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [searchTerm, filters, selectedFacets]);

  const handleFilterPanelChange = (filter: Record<string, string | null>) => {
    // If the user unchecks a box, remove that filter from state
    // If the user checks a box, set that filter
    const [facetName, value] = Object.entries(filter)[0];
    setFilters((prev) => {
      if (!value) {
        const temp = { ...prev };
        delete temp[facetName];
        return temp;
      }
      return { ...prev, [facetName]: { eq: value } };
    });
  };

  // Turn the facets object into an array of { name, buckets } for FilterPanel
  const facetArray: Facet[] = facets
    ? Object.entries(facets).map(([facetName, facetValues]) => ({
        name: facetName,
        buckets: Object.entries(facetValues || {}).map(([val, count]) => ({
          value: val,
          count,
        })),
      }))
    : [];

  // Example: gather currently applied filters for displaying badges
  const activeFilters = Object.entries(filters).map(([facetName, filterObj]) =>
    filterObj.eq ? filterObj.eq : ""
  );

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed left panel */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r p-4 hidden sm:block overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <FilterPanel
            facets={facetArray}
            filterDefs={filterDefs}
            onChange={handleFilterPanelChange}
          />
        </Suspense>
      </aside>

      {/* Main content area with left margin */}
      <main className="sm:ml-64 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <SearchInput onSearch={setSearchTerm} />

          {activeFilters.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 my-4">
              {activeFilters.map((val) => (
                <div
                  key={val}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  {val} ✕
                </div>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-blue-600 text-sm ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="mt-4">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-md p-4 h-64 animate-pulse"
                    >
                      <div className="aspect-[3/2] bg-gray-200 mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults === null ? (
                  [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-md p-4 h-64 animate-pulse"
                    >
                      <div className="aspect-[3/2] bg-gray-200 mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))
                ) : searchResults?.length > 0 ? (
                  searchResults.map((r, key) => (
                    <div
                      key={key}
                      className="bg-white border rounded-md p-4 shadow-sm"
                    >
                      <Suspense>
                        <SearchResultCard {...r} />
                      </Suspense>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    No searchResults found. Try adjusting your search or
                    filters.
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export type SearchComponentProps = {
  selectedFacets: string[];
};

export type SearchComponentSlots = "searchResults";

export default SearchContainer;
