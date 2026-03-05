import {
  type ComponentProps,
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { Suspense } from "react";
import { SearchPageProviderWithState } from "./SearchPageProviderWithState";
import { URLSearchParameterSync } from "./URLSearchParameterSync";

type SearchContainerParameters = {
  coveoPipelineName?: string;
};

export function SearchContainer({
  component,
}: ComponentProps<SearchContainerParameters>) {
  const coveoPipelineName = component?.parameters?.coveoPipelineName as
    | string
    | undefined;

  return (
    <Suspense fallback={null}>
      <SearchPageProviderWithState pipeline={coveoPipelineName}>
        <URLSearchParameterSync />
        <div className="flex w-[80vw] mx-auto gap-4">
          <div className="w-[30%] min-w-0 shrink-0">
            <UniformSlot name="sidebar" />
          </div>
          <div className="w-[70%] min-w-0">
            <UniformSlot name="content" />
          </div>
        </div>
      </SearchPageProviderWithState>
    </Suspense>
  );
}

registerUniformComponent({
  type: "searchContainer",
  component: SearchContainer,
});
