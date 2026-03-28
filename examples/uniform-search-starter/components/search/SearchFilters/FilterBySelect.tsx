import { useCallback, ChangeEvent, FC, useState } from 'react';
import { FilterByProps } from './SearchFilters';

function formatSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const FilterBySelect: FC<FilterByProps> = ({ fieldKey, values, selectedValues, onFilterChange, facetValues, type }) => {
  const [localSelectedValues, setLocalSelectedValues] = useState(selectedValues);
  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (localSelectedValues?.includes(value)) {
        const newSelectedValues = localSelectedValues.filter(filter => filter !== value);
        setLocalSelectedValues(newSelectedValues);
        onFilterChange?.(fieldKey, newSelectedValues);
      } else {
        const newSelectedValues = type === 'multiSelect' ? [...(localSelectedValues || []), value] : [value];
        setLocalSelectedValues(newSelectedValues);
        onFilterChange?.(fieldKey, newSelectedValues);
      }
    },
    [localSelectedValues, onFilterChange, fieldKey, type]
  );

  return (
    <div className="space-y-1">
      {(values || []).map(({ value, title }) => {
        const isSelected = localSelectedValues?.includes(value);
        const hasFacetData = facetValues && Object.keys(facetValues).length > 0;
        const isDisabled = hasFacetData && !facetValues[value] && !isSelected;

        return (
          <label
            key={value}
            className={`flex items-center gap-2 py-0.5 text-sm transition-opacity ${isDisabled ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
          >
            <input
              type="checkbox"
              value={value}
              checked={!!isSelected}
              onChange={handleFilterChange}
              disabled={isDisabled}
              className="accent-mono-900 h-3.5 w-3.5"
            />
            <span className="text-mono-700">{title || formatSlug(value)}</span>
            {facetValues?.[value] != null && (
              <span className="text-xs text-mono-400">({facetValues[value]})</span>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default FilterBySelect;
