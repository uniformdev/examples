"use client";

import { useSearchBox } from "@/lib/coveo/engine-definition";
import {
  type ComponentParameter,
  type ComponentProps,
  UniformText,
} from "@uniformdev/next-app-router/component";

type SearchBarParameters = {
  buttonText?: ComponentParameter<string>;
  placeholder?: ComponentParameter<string>;
};

export function SearchBar({
  parameters: { buttonText, placeholder } = {},
  component,
}: ComponentProps<SearchBarParameters> = {} as ComponentProps<SearchBarParameters>) {
  const searchBox = useSearchBox();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchBox.methods?.updateText(e.target.value);
  };

  const placeholderStr =
    typeof placeholder?.value === "string" ? placeholder.value : "Search";
  const buttonStr =
    typeof buttonText?.value === "string" ? buttonText.value : "Search";

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
        {component && buttonText ? (
          <UniformText
            component={component}
            parameter={buttonText}
            placeholder="Search"
          />
        ) : (
          buttonStr
        )}
      </button>
    </div>
  );
}
