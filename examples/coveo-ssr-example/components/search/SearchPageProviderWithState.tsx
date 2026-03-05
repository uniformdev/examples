"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import type { SearchStaticState } from "@/lib/coveo/engine-definition";
import { SearchPageProvider } from "@/components/search/SearchPageProvider";

export function SearchPageProviderWithState({
  pipeline,
  children,
}: PropsWithChildren<{ pipeline: string | undefined }>) {
  const [staticState, setStaticState] = useState<SearchStaticState | null>(
    null
  );

  useEffect(() => {
    const url = pipeline
      ? `/api/coveo-static-state?pipeline=${encodeURIComponent(pipeline)}`
      : "/api/coveo-static-state";
    fetch(url)
      .then((res) => res.json())
      .then((data) => setStaticState(data))
      .catch((err) => {
        console.error("[alex] SearchPageProviderWithState fetch error:", err);
      });
  }, [pipeline]);

  if (!staticState) {
    return null;
  }

  return (
    <SearchPageProvider staticState={staticState} pipeline={pipeline}>
      {children}
    </SearchPageProvider>
  );
}
