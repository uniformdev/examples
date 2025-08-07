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

export interface IntegrationTypeConfig {
  custom: {
    searchCriteria: string;
    limit: number;
    enableLocaleFilter: boolean;
    defaultLocale: string;
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
    identifier: {
      displayName: "Product Identifier",
      type: "string",
      helpText: "The identifier of the product to fetch",
      default: "",
    },
    locale: {
      displayName: "Locale",
      type: "string",
      helpText: "The locale to filter products by (e.g., en_US, fr_FR)",
      default: "en_US",
    },
  },
  parameters: [
    {
      key: "search",
      value: '{"identifier":[{"operator":"=","value":"${identifier}"}]}',
      omitIfEmpty: true,
    },
    {
      key: "limit",
      value: "1",
    },
  ],
  custom: {
    searchCriteria: "identifier",
    enableLocaleFilter: false,
    defaultLocale: "en_US",
  },
};

// This component is used to configure the data type for single product selection.
// It allows configuring search criteria for finding products in Akeneo PIM.

const SingleProductTypeEditorPage: React.FC = () => {
  const { value, setValue, getDataResource } = useMeshLocation<
    "dataType",
    IntegrationTypeConfig
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

  const handleChange = (updates: Partial<IntegrationTypeConfig['custom']>) => {
    const currentCustom = value?.custom || {};
    const newCustom = { ...currentCustom, ...updates };

    setValue(() => ({
      newValue: {
        ...value,
        custom: newCustom,
        path: "/products",
        variables: {
          identifier: {
            displayName: "Product Identifier",
            type: "string",
            helpText: "The identifier of the product to fetch",
            default: "",
          },
          locale: {
            displayName: "Locale",
            type: "string",
            helpText: "The locale to filter products by (e.g., en_US, fr_FR). Can be bound to ${locale} token.",
            default: newCustom.defaultLocale || "en_US",
          },
        },
        parameters: [
          {
            key: "search",
            value: `{"${newCustom.searchCriteria || 'identifier'}":[{"operator":"=","value":"\${identifier}"}]}`,
            omitIfEmpty: true,
          },
          {
            key: "limit",
            value: "1",
          },
          ...(newCustom.enableLocaleFilter ? [{
            key: "locales",
            value: "${locale}",
            omitIfEmpty: true,
          }] : []),
        ],
      },
    }));
  };

  // Available search criteria for Akeneo products
  // These are the most commonly used searchable fields in Akeneo PIM
  const searchOptions = [
    { value: "identifier", label: "Product Identifier" },
    { value: "family", label: "Product Family" },
    { value: "enabled", label: "Enabled Status" },
  ];

  const customSettings = value?.custom;
  const searchCriteria = (customSettings?.searchCriteria as string) || "identifier";
  const enableLocaleFilter = (customSettings?.enableLocaleFilter as boolean) || false;
  const defaultLocale = (customSettings?.defaultLocale as string) || "en_US";

  return (
    <VerticalRhythm style={{ minHeight: "400px" }}>
      <Label>Search Field</Label>
      <InputComboBox
        name="searchCriteria"
        id="searchCriteria"
        onChange={(e) => handleChange({ searchCriteria: e.value })}
        options={searchOptions}
        value={{
          value: searchCriteria,
          label: searchOptions.find(opt => opt.value === searchCriteria)?.label || "Identifier",
        }}
      />
      <Caption>
        The field to use for product search and filtering in the product selector.
      </Caption>

      <Label>Locale Filtering</Label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id="enableLocaleFilter"
          checked={enableLocaleFilter}
          onChange={(e) => handleChange({ enableLocaleFilter: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="enableLocaleFilter" className="text-sm">
          Enable locale-based product filtering
        </label>
      </div>
      <Caption>
        When enabled, products will be filtered by locale. This adds a locale variable that can be bound to Uniform's ${`{locale}`} token.
      </Caption>

      {enableLocaleFilter && (
        <>
          <Label>Default Locale</Label>
          <Input
            id="defaultLocale"
            name="defaultLocale"
            value={defaultLocale}
            onChange={(e) => handleChange({ defaultLocale: e.currentTarget.value })}
            placeholder="en_US"
          />
          <Caption>
            Default locale value (e.g., en_US, fr_FR, de_DE). This can be overridden by binding the locale variable to ${`{locale}`} token.
          </Caption>
        </>
      )}
    </VerticalRhythm>
  );
};

export default SingleProductTypeEditorPage;