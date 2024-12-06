"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResolveComponentResultWithType } from "@/uniform/models";
import { ContentClient } from "@uniformdev/canvas";

const SearchComponent = async () => {
  const placeholder = (
    <div>
      <p>Loading search</p>
    </div>
  );

  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const skip = searchParams.get("skip");
  const take = searchParams.get("take");
  const type = searchParams.get("type");

  const contentClient = new ContentClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
  });

  const results = await contentClient.getEntries({
    search: search ?? "",
    filters: {
      type: { eq: type ?? "" },
    },
    limit: take ? parseInt(take) : 0,
    offset: skip ? parseInt(skip) : 10,
  });

  return (
    <Suspense fallback={placeholder}>
      <pre>
        {JSON.stringify(
          results?.entries[0]?.entry.fields?.rideName?.value,
          null,
          2
        )}
      </pre>
    </Suspense>
  );
};

export default SearchComponent;

export const searchMapping: ResolveComponentResultWithType = {
  type: "search",
  component: SearchComponent,
};
