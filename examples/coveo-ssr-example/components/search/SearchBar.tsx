"use client";

import { useSearchBox } from "@/lib/coveo/engine-definition";
import {
  type ComponentProps,
  registerUniformComponent,
  UniformText,
} from "@uniformdev/canvas-react";

type SearchBarParameters = {
  buttonText?: string;
  placeholder?: string;
};

export function SearchBar({
  component,
}: ComponentProps<SearchBarParameters> = {} as ComponentProps<SearchBarParameters>) {
  const searchBox = useSearchBox();
  const placeholderParam = component?.parameters?.placeholder as
    | { value?: string }
    | undefined;
  const buttonTextParam = component?.parameters?.buttonText as
    | { value?: string }
    | undefined;
  const placeholderStr = placeholderParam?.value ?? "Search";
  const buttonStr = buttonTextParam?.value ?? "Search";

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchBox.methods?.updateText(e.target.value);
  };

  return (
    <div className="flex gap-2">
      <input
        type="search"
        aria-label="Search"
        placeholder={placeholderStr}
        value={searchBox.state.value}
        onChange={onInputChange}
        onKeyDown={(e) => e.key === "Enter" && searchBox.methods?.submit()}
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={() => searchBox.methods?.submit()}
        className="rounded border border-gray-600 bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
      >
        {component ? (
          <UniformText
            parameterId="buttonText"
            placeholder="Search"
          />
        ) : (
          buttonStr
        )}
      </button>
    </div>
  );
}

registerUniformComponent({
  type: "searchBar",
  component: SearchBar,
});
