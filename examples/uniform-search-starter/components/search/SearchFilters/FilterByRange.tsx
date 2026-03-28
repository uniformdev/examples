import { FC, useState } from 'react';
import { FilterByProps } from './SearchFilters';

const FilterByRange: FC<FilterByProps> = ({ fieldKey, values, selectedValues, onFilterChange }) => {
  const allValues = (values || []).map(v => Number(v.value));
  const minPossible = Math.min(...allValues);
  const maxPossible = Math.max(...allValues);

  const [minValue, setMinValue] = useState(Number(selectedValues?.[0]) || minPossible);
  const [maxValue, setMaxValue] = useState(Number(selectedValues?.[1]) || maxPossible);

  const handleCommit = () => {
    onFilterChange?.(fieldKey, [minValue.toString(), maxValue.toString()]);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={minValue}
        min={minPossible}
        max={maxPossible}
        onChange={e => setMinValue(Number(e.target.value))}
        onBlur={handleCommit}
        className="w-20 border border-mono-200 bg-mono-50 px-2 py-1 text-sm text-mono-900 focus:border-mono-900 focus:outline-none transition-colors"
      />
      <span className="text-mono-400">&ndash;</span>
      <input
        type="number"
        value={maxValue}
        min={minPossible}
        max={maxPossible}
        onChange={e => setMaxValue(Number(e.target.value))}
        onBlur={handleCommit}
        className="w-20 border border-mono-200 bg-mono-50 px-2 py-1 text-sm text-mono-900 focus:border-mono-900 focus:outline-none transition-colors"
      />
    </div>
  );
};

export default FilterByRange;
