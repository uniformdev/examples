import { FC } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
  UniformSlot,
} from '@uniformdev/canvas-react';
import { SearchProvider } from '@uniformdev/search/react';
import { performSearch } from '@/lib/search/searchClient';

type SearchEngineProps = ComponentProps<{
  contentType?: string;
  filterBy?: unknown;
  orderBy?: unknown;
  baseFilters?: unknown;
  pageSizes?: unknown;
  collections?: string | string[];
}>;

const SearchEngine: FC<SearchEngineProps> = ({
  contentType,
  filterBy,
  orderBy,
  baseFilters,
  pageSizes,
  collections,
}) => {
  return (
    <SearchProvider
      performSearch={performSearch}
      contentType={contentType}
      filterBy={filterBy}
      orderBy={orderBy}
      baseFilters={baseFilters}
      pageSizes={pageSizes}
      collections={collections}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center gap-4 border-b border-mono-200 pb-5 mb-8">
          <UniformSlot name="search-top" />
        </div>
        <div className="grid grid-cols-[240px_1fr] gap-10">
          <UniformSlot name="search-main" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-mono-200 pt-5 mt-8">
          <UniformSlot name="search-bottom" />
        </div>
      </div>
    </SearchProvider>
  );
};

registerUniformComponent({
  type: 'searchEngine',
  component: SearchEngine,
});

export default SearchEngine;
