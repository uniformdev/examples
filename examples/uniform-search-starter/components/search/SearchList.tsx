import { FC } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
} from '@uniformdev/canvas-react';
import { useSearch } from '@uniformdev/search/react';
import { Loading } from '@/components/search/ui/Loading';
import type { SearchHit } from '@uniformdev/search';

type SearchListProps = ComponentProps<{
  noResultsFoundText?: string;
  tryDifferentFiltersText?: string;
  clearAllFilterText?: string;
}>;

function getTitle(hit: SearchHit): string {
  return String(hit.title || hit.name || hit.slug || hit.id || '');
}

function getDescription(hit: SearchHit): string {
  const desc = hit.shortDescription || hit.searchableText || hit.extractedText || '';
  const str = String(desc);
  return str.length > 120 ? `${str.slice(0, 120)}...` : str;
}

function getThumbnail(hit: SearchHit): string | undefined {
  if (typeof hit.thumbnail === 'string' && hit.thumbnail) return hit.thumbnail;
  return undefined;
}

const SearchList: FC<SearchListProps> = ({
  noResultsFoundText = 'No results found',
  tryDifferentFiltersText = 'Try different filters or',
  clearAllFilterText = 'clear all filters',
}) => {
  const { results, isLoading, clearFilters } = useSearch();
  const isEmpty = results?.items.length === 0;

  return (
    <div className="relative min-h-[200px]">
      {isEmpty && !isLoading ? (
        <div className="text-center py-16">
          <p className="text-mono-900 font-medium">{noResultsFoundText}</p>
          <p className="text-sm text-mono-500 mt-1">
            {tryDifferentFiltersText}{' '}
            <button onClick={clearFilters} type="button" className="underline underline-offset-2 hover:text-mono-900 transition-colors">
              {clearAllFilterText}
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {results?.items.map(hit => {
            const thumbnail = getThumbnail(hit);
            const title = getTitle(hit);
            const description = getDescription(hit);
            const contentType = String(hit.contentType || hit.compositionType || hit.mediaType || '');
            const slug = String(hit.slug || hit.path || '');

            return (
              <div key={hit.id} className="group">
                {thumbnail && (
                  <div className="bg-mono-100 mb-3 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-full aspect-square object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-sm font-medium text-mono-900 leading-snug">{title}</h3>
                {description && (
                  <p className="text-xs text-mono-500 mt-1 leading-relaxed">{description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {contentType && (
                    <span className="text-[11px] text-mono-400 uppercase tracking-wider">{contentType}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {slug && (
                    <span className="text-[11px] text-mono-400 uppercase tracking-wider">{slug}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

registerUniformComponent({
  type: 'searchList',
  component: SearchList,
});

export default SearchList;
