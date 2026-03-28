import { FC } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
} from '@uniformdev/canvas-react';
import { useSearchPagination, DOTS } from '@uniformdev/search/react';

type SearchPaginationProps = ComponentProps<{
  siblingCount?: number;
}>;

const SearchPagination: FC<SearchPaginationProps> = ({ siblingCount }) => {
  const { pages, currentPage, hasPrev, hasNext, goToPage, goToPrev, goToNext, isLoading } =
    useSearchPagination(siblingCount);

  if (pages.length < 2) return null;

  return (
    <nav role="navigation" aria-label="Pagination" className="flex items-center gap-1 justify-center">
      <button
        disabled={!hasPrev || isLoading}
        onClick={goToPrev}
        aria-label="Go to previous page"
        className="px-3 py-1.5 text-sm text-mono-600 hover:text-mono-900 disabled:opacity-30 disabled:cursor-default transition-colors"
      >
        &larr; Prev
      </button>
      {pages.map((pageNumber, i) =>
        pageNumber === DOTS ? (
          <span key={`dots-${i}`} aria-hidden="true" className="px-1 text-mono-400">&hellip;</span>
        ) : (
          <button
            key={`page-${pageNumber}`}
            disabled={isLoading}
            onClick={() => goToPage(Number(pageNumber) - 1)}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === currentPage + 1 ? 'page' : undefined}
            className={`w-8 h-8 text-sm transition-colors ${pageNumber === currentPage + 1 ? 'bg-mono-900 text-white' : 'text-mono-600 hover:bg-mono-100'} disabled:opacity-50`}
          >
            {pageNumber}
          </button>
        )
      )}
      <button
        disabled={!hasNext || isLoading}
        onClick={goToNext}
        aria-label="Go to next page"
        className="px-3 py-1.5 text-sm text-mono-600 hover:text-mono-900 disabled:opacity-30 disabled:cursor-default transition-colors"
      >
        Next &rarr;
      </button>
    </nav>
  );
};

registerUniformComponent({
  type: 'searchPagination',
  component: SearchPagination,
});

export default SearchPagination;
