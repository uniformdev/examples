import { FC } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
} from '@uniformdev/canvas-react';
import { useSearch } from '@uniformdev/search/react';

type SearchPageSizeProps = ComponentProps;

const SearchPageSize: FC<SearchPageSizeProps> = () => {
  const { pageSize, setPageSize, pageSizes, isLoading } = useSearch();

  return (
    <select
      value={pageSize}
      onChange={e => !isLoading && setPageSize(Number(e.target.value))}
      className="border border-mono-200 bg-mono-50 px-3 py-2 text-sm text-mono-700 focus:border-mono-900 focus:outline-none appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
    >
      {pageSizes.map(ps => (
        <option key={ps.size} value={ps.size}>
          {ps.size}
        </option>
      ))}
    </select>
  );
};

registerUniformComponent({
  type: 'searchPageSize',
  component: SearchPageSize,
});

export default SearchPageSize;
