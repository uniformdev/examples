import { FC, useRef, useCallback } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
} from '@uniformdev/canvas-react';
import { useSearch } from '@uniformdev/search/react';
import type { FilterBy as FilterByType } from '@uniformdev/search';
import FilterByRange from './FilterByRange';
import FilterBySelect from './FilterBySelect';

const filterByComponents = {
  select: FilterBySelect,
  multiSelect: FilterBySelect,
  range: FilterByRange,
};

export type FilterByProps = FilterByType & {
  selectedValues?: string[];
  onFilterChange?: (fieldId: string, value: string[]) => void;
  facetValues?: Record<string, number>;
};

type SearchFiltersProps = ComponentProps;

const SearchFilters: FC<SearchFiltersProps> = () => {
  const { filterOptions, selectedFilters, setSelectedFilters, facets } = useSearch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFilterChange = useCallback((fieldId: string, value: string[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSelectedFilters({ ...selectedFilters, [fieldId]: value });
    }, 600);
  }, [selectedFilters, setSelectedFilters]);

  return (
    <aside>
      {filterOptions?.map(filter => {
        const Component = filterByComponents[filter.type as keyof typeof filterByComponents];
        if (!Component) return null;
        return (
          <div key={filter.fieldKey} className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-2">{filter.title}</h3>
            <Component
              {...filter}
              selectedValues={selectedFilters[filter.fieldKey] || []}
              onFilterChange={handleFilterChange}
              facetValues={facets?.[filter.fieldKey] || {}}
            />
          </div>
        );
      })}
    </aside>
  );
};

registerUniformComponent({
  type: 'searchFilters',
  component: SearchFilters,
});

export default SearchFilters;
