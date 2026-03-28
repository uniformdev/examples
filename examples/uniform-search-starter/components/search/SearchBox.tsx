import { FC, useState, useEffect } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from '@uniformdev/canvas-react';
import { useSearch } from '@uniformdev/search/react';

type SearchBoxProps = ComponentProps<{
  placeholder?: string;
  label?: string;
}>;

const SearchBox: FC<SearchBoxProps> = ({ placeholder }) => {
  const { searchBoxValue, setSearchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-w-[400px] flex-1">
      <UniformText parameterId="label" placeholder="Search label" as="label" className="sr-only" />
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mono-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={searchBoxValue}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-mono-200 bg-mono-50 py-2 pl-9 pr-9 text-sm text-mono-900 placeholder:text-mono-400 focus:border-mono-900 focus:outline-none transition-colors"
        />
        {mounted && searchBoxValue && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mono-400 hover:text-mono-900 text-lg leading-none transition-colors"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'searchBox',
  component: SearchBox,
});

export default SearchBox;
