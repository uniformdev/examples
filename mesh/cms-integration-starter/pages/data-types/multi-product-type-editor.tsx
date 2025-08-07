import React, { useEffect } from "react";
import {
  useMeshLocation,
  DataTypeLocationValue,
} from "@uniformdev/mesh-sdk-react";
import {
  VerticalRhythm,
  InputComboBox,
  Input,
  Label,
  Caption,
} from "@uniformdev/design-system";

export interface MultiProductTypeConfig {
  custom: {
    searchCriteria: string;
    limit: number;
    enabledOnly: boolean;
  };
}

interface DataTypeLocationValueExtended extends DataTypeLocationValue {
  ttl?: number;
}

const DEFAULT_VALUE: DataTypeLocationValueExtended = {
  path: "/products",
  ttl: 300, // 5 minutes cache time for product data
  method: "GET",
  variables: {
    page: {
      displayName: "Page",
      type: "number",
      helpText: "Page number for pagination",
      default: "1",
    },
    limit: {
      displayName: "Limit",
      type: "number", 
      helpText: "Number of products per page",
      default: "100",
    },
    search: {
      displayName: "Search Query",
      type: "string",
      helpText: "Search query to filter products",
      default: "",
    },
  },
  parameters: [
    {
      key: "page",
      value: "${page}",
    },
    {
      key: "limit",
      value: "${limit}",
    },
    {
      key: "search",
      value: "${search}",
      omitIfEmpty: true,
    },
  ],
  custom: {
    searchCriteria: "identifier",
    limit: 100,
    enabledOnly: true,
  },
};

// This component is used to configure the data type for multiple product selection.
// It allows configuring search criteria and limits for finding products in Akeneo PIM.

const MultiProductTypeEditorPage: React.FC = () => {
  const { value, setValue } = useMeshLocation<
    "dataType",
    MultiProductTypeConfig
  >();

  useEffect(() => {
    if (!value?.path) {
      setValue(() => ({
        newValue: {
          ...DEFAULT_VALUE,
        },
      }));
    }
  }, [value, setValue]);

  const handleSearchCriteriaChange = (searchCriteria: string) => {
    const currentCustom = value?.custom || {};
    setValue(() => ({
      newValue: {
        ...value,
        custom: {
          ...currentCustom,
          searchCriteria,
        },
      },
    }));
  };

  const handleLimitChange = (limit: number) => {
    const currentCustom = value?.custom || {};
    setValue(() => ({
      newValue: {
        ...value,
        custom: {
          ...currentCustom,
          limit,
        },
        variables: {
          ...value.variables,
          limit: {
            ...value.variables?.limit,
            default: limit.toString(),
          },
        },
      },
    }));
  };

  const handleEnabledOnlyChange = (enabledOnly: boolean) => {
    const currentCustom = value?.custom || {};
    setValue(() => ({
      newValue: {
        ...value,
        custom: {
          ...currentCustom,
          enabledOnly,
        },
      },
    }));
  };

  // Available search criteria for Akeneo products
  const searchOptions = [
    { value: "identifier", label: "Identifier" },
    { value: "family", label: "Family" },
    { value: "categories", label: "Categories" },
    { value: "enabled", label: "Enabled Status" },
  ];

  const customSettings = value?.custom;
  const searchCriteria = (customSettings?.searchCriteria as string) || "identifier";
  const limit = (customSettings?.limit as number) || 100;
  const enabledOnly = (customSettings?.enabledOnly as boolean) ?? true;

  return (
    <VerticalRhythm style={{ minHeight: "400px" }}>
      <Label>Search Criteria</Label>
      <InputComboBox
        name="searchCriteria"
        id="searchCriteria"
        onChange={(e) => handleSearchCriteriaChange(e.value)}
        options={searchOptions}
        value={{
          value: searchCriteria,
          label: searchOptions.find(opt => opt.value === searchCriteria)?.label || "Identifier",
        }}
      />
      <Caption>
        The primary criteria to use when searching for products.
      </Caption>

      <Label>Default Product Limit</Label>
      <Input
        id="limit"
        name="limit"
        type="number"
        value={limit.toString()}
        onChange={(e) => handleLimitChange(parseInt(e.currentTarget.value) || 100)}
        min="1"
        max="1000"
      />
      <Caption>
        Default number of products to fetch per page (1-1000).
      </Caption>

      <Label>Filter Settings</Label>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enabledOnly"
          checked={enabledOnly}
          onChange={(e) => handleEnabledOnlyChange(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="enabledOnly" className="text-sm">
          Show enabled products only
        </label>
      </div>
      <Caption>
        When enabled, only products marked as enabled in Akeneo will be shown.
      </Caption>
    </VerticalRhythm>
  );
};

export default MultiProductTypeEditorPage;