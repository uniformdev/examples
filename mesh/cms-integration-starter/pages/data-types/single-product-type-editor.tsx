import React, { useEffect } from "react";
import {
  useMeshLocation,
  DataTypeLocationValue,
} from "@uniformdev/mesh-sdk-react";
import {
  VerticalRhythm,
  InputComboBox,
  Label,
  Caption,
} from "@uniformdev/design-system";
import { DEFAULT_CONTENT_TYPE } from "../../lib/constants";
import { useAsync } from "react-use";

export interface IntegrationTypeConfig {
  custom: {
    searchCriteria: string;
    limit: number;
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
  },
  parameters: [
    {
      key: "search",
      value: "identifier=${identifier}",
    },
    {
      key: "limit",
      value: "1",
    },
  ],
  custom: {
    searchCriteria: "identifier",
    limit: 1,
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

  const handleChange = (searchCriteria: string) => {
    setValue(() => ({
      newValue: {
        ...value,
        custom: {
          searchCriteria,
          limit: 1,
        },
        parameters: [
          {
            key: "search",
            value: `${searchCriteria}=\${identifier}`,
          },
          {
            key: "limit",
            value: "1",
          },
        ],
      },
    }));
  };

  // Available search criteria for Akeneo products
  const searchOptions = [
    { value: "identifier", label: "Identifier" },
    { value: "family", label: "Family" },
    { value: "enabled", label: "Enabled Status" },
    { value: "categories", label: "Categories" },
  ];

  const customSettings = value?.custom;
  const searchCriteria =
    (customSettings?.searchCriteria as string) || "identifier";

  return (
    <VerticalRhythm style={{ minHeight: "300px" }}>
      <Label>Search Criteria</Label>
      <InputComboBox
        name="searchCriteria"
        id="searchCriteria"
        onChange={(e) => handleChange(e.value)}
        options={searchOptions}
        value={{
          value: searchCriteria,
          label: searchOptions.find(opt => opt.value === searchCriteria)?.label || "Identifier",
        }}
      />
      <Caption>
        The criteria to use when searching for products. This determines how 
        the product identifier will be matched in Akeneo PIM.
      </Caption>
    </VerticalRhythm>
  );
};

export default SingleProductTypeEditorPage;