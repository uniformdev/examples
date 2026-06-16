import { VerticalRhythm } from '@uniformdev/design-system';
import { Callout, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/**
 * Data Resource Selector demonstration
 *
 * This location replaces the default JSON tree viewer when selecting dynamic tokens
 * from data of an archetype that has dataResourceSelectorUrl configured.
 *
 * Available metadata:
 * - dataResourceValue: The resolved data for the data resource
 * - dataResourceName: The name of the data resource
 * - dataTypeId: The data type ID (for fetching additional context if needed)
 * - archetype: The archetype key (useful for apps sharing a selector across archetypes)
 * - allowedTypes: Array of bindable types valid for selection
 * - componentDefinitions: Component definitions index, keyed by public id
 *
 * Available location API:
 * - editorState: Imperative API for inspecting/mutating the composition/entry tree (use for component/root context)
 *
 * The mesh app can call setValue with a JSON pointer, and getDataResource to fetch more data.
 */

const DataResourceSelector: NextPage = () => {
  const location = useMeshLocation('dataResourceSelector');
  const { value, setValue, metadata, isReadOnly } = location;
  const { dataResourceValue } = metadata;

  if (!dataResourceValue || typeof dataResourceValue !== 'object') {
    return <Callout type="info">No data available for this data resource.</Callout>;
  }

  // Get top-level keys from the data resource
  const keys = Object.keys(dataResourceValue);

  const handleSelect = (valueToSelect: string) => {
    if (isReadOnly) {
      return;
    }
    // Set the JSON pointer for the selected key
    setValue(() => {
      return {
        newValue: valueToSelect,
      };
    });
  };

  return (
    <VerticalRhythm style={{ padding: 'var(--spacing-base)' }}>
      <strong>Select a top-level array:</strong>

      <VerticalRhythm gap="xs">
        {keys.map((key) => {
          const jsonPointerToSelect = `/${key}`;
          const isSelected = value === jsonPointerToSelect;
          const targetValue = (dataResourceValue as Record<string, unknown>)[key];

          if (!Array.isArray(targetValue)) {
            return null;
          }

          return (
            <button
              key={key}
              onClick={() => handleSelect(jsonPointerToSelect)}
              disabled={isReadOnly}
              style={{ border: 0, background: 'none', textAlign: 'left' }}
            >
              {key} {isSelected ? '✅' : ''}
            </button>
          );
        })}
      </VerticalRhythm>

      {value ? (
        <div>
          <strong>Current selection:</strong> <code>{value}</code>
        </div>
      ) : null}
    </VerticalRhythm>
  );
};

export default DataResourceSelector;
