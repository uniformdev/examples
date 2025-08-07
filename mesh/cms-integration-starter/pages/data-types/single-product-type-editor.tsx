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
    attributes: string[];
    thumbnailImageAttribute: string;
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
    attributes: [],
    thumbnailImageAttribute: "image_1",
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

  // Available attribute options for Akeneo products
  const attributeOptions = [
    { value: "sku", label: "SKU" },
    { value: "fabric", label: "Fabric" },
    { value: "gender", label: "Gender" },
    { value: "image_1", label: "Image 1" },
    { value: "image_2", label: "Image 2" },
    { value: "image_3", label: "Image 3" },
    { value: "returnable", label: "Returnable" },
    { value: "description", label: "Description" },
    { value: "short_description", label: "Short Description" },
    { value: "manufacturer_warranty", label: "Manufacturer Warranty" },
    { value: "name", label: "Name" },
    { value: "brand", label: "Brand" },
    { value: "color", label: "Color" },
    { value: "price", label: "Price" },
    { value: "erp_name", label: "ERP Name" },
    { value: "packshot", label: "Packshot" },
  ];

  // Available thumbnail image attribute options
  const thumbnailImageOptions = [
    { value: "image_1", label: "Image 1" },
    { value: "image_2", label: "Image 2" },
    { value: "image_3", label: "Image 3" },
  ];

  const customSettings = value?.custom;
  const searchCriteria = (customSettings?.searchCriteria as string) || "identifier";
  const enableLocaleFilter = (customSettings?.enableLocaleFilter as boolean) || false;
  const defaultLocale = (customSettings?.defaultLocale as string) || "en_US";
  const attributes = (customSettings?.attributes as string[]) || [];
  const thumbnailImageAttribute = (customSettings?.thumbnailImageAttribute as string) || "image_1";

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

      <Label>Akeneo Attributes</Label>
      <InputComboBox
        name="attributes"
        id="attributes"
        onChange={(newValue) => {
          const selectedOptions = newValue ? Array.from(newValue as readonly { value: string; label: string }[]) : [];
          const selectedAttributes = selectedOptions.map(option => option.value);
          handleChange({ attributes: selectedAttributes });
        }}
        options={attributeOptions}
        value={attributes.map(attr => {
          const option = attributeOptions.find(opt => opt.value === attr);
          return option || { value: attr, label: attr };
        })}
        isMulti
        isSearchable
        isClearable
        placeholder="Select attributes to retrieve from Akeneo..."
      />
      <Caption>
        Choose which Akeneo product attributes to retrieve. If none selected, all available attributes will be fetched.
      </Caption>

      <Label>Thumbnail Image Attribute</Label>
      <InputComboBox
        name="thumbnailImageAttribute"
        id="thumbnailImageAttribute"
        onChange={(e) => handleChange({ thumbnailImageAttribute: e.value })}
        options={thumbnailImageOptions}
        value={{
          value: thumbnailImageAttribute,
          label: thumbnailImageOptions.find(opt => opt.value === thumbnailImageAttribute)?.label || "Image 1",
        }}
        placeholder="Select thumbnail image attribute..."
      />
      <Caption>
        Choose which image attribute to use as the thumbnail in the product selector list.
      </Caption>
    </VerticalRhythm>
  );
};

export default SingleProductTypeEditorPage;