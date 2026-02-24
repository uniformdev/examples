
import type { ComponentProps } from "@uniformdev/next-app-router/component";
import { UniformSlot } from "@uniformdev/next-app-router/component";
import { Suspense } from "react";
import { SearchPageProviderWithState } from "./SearchPageProviderWithState";
import { URLSearchParameterSync } from "./URLSearchParameterSync";

type SearchContainerParameters = {
  coveoPipelineName?: string;
};

type SearchContainerSlots = "content";

type SearchContainerProps = ComponentProps<
  SearchContainerParameters,
  SearchContainerSlots
>;

export function SearchContainer({ slots, parameters }: SearchContainerProps) {
  return (
    <Suspense fallback={null}>
      <SearchPageProviderWithState pipeline={parameters?.coveoPipelineName}>
        <URLSearchParameterSync />
        <div>
          <UniformSlot slot={slots.content} />
        </div>
      </SearchPageProviderWithState>
    </Suspense>

  );
}
