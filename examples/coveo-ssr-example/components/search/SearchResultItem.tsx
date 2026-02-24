"use client";

import type { Result } from "@coveo/headless/ssr";

interface SearchResultItemProps {
  result: Result;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const title = result.title ?? result.raw?.title ?? "Untitled";
  const clickUri = result.clickUri ?? result.raw?.clickuri ?? "#";
  const excerpt = result.excerpt ?? result.raw?.excerpt ?? "";

  return (
    <article className="border-b border-gray-200 py-3">
      <h3 className="text-sm font-medium">
        <a
          href={clickUri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {title}
        </a>
      </h3>
      {excerpt && (
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{excerpt}</p>
      )}
    </article>
  );
}
