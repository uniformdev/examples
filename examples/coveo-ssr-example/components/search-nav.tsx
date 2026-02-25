"use client";

import { useState } from "react";
import Link from "next/link";

export function SearchNav() {
  const [query, setQuery] = useState("");

  const searchHref = `/search#q=${encodeURIComponent(query)}`;

  return (
    <div className="search-nav border-2 border-gray-300 rounded-md p-2">
      Search in the header example
      <hr />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search query"
      />
      <Link href={searchHref}>Search</Link>
    </div>
  );
}
