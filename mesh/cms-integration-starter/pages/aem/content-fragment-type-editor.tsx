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

// Available AEM component types from our mock data
const AEM_COMPONENT_TYPES = [
  { value: "quicklinkscarousel", label: "Quick Links Carousel" },
  { value: "herobanner", label: "Hero Banner" },
  { value: "promobanner", label: "Promo Banner" },
  { value: "editorialcards", label: "Editorial Cards" },
  { value: "popularcategories", label: "Popular Categories" },
  { value: "sustainabilitysection", label: "Sustainability Section" },
  { value: "productcategorygrid", label: "Product Category Grid" },
  { value: "interestcategories", label: "Interest Categories" },
  { value: "valuepropositions", label: "Value Propositions" },
];

export interface AemContentFragmentTypeConfig {
  custom: {
    componentType: string;
  };
}

interface DataTypeLocationValueExtended extends DataTypeLocationValue {
  ttl?: number;
}

const DEFAULT_COMPONENT_TYPE = "herobanner";

const DEFAULT_VALUE: DataTypeLocationValueExtended = {
  path: "/api/aem/content",
  ttl: 60,
  method: "GET",
  variables: {
    component: {
      displayName: "Component Type",
      type: "string",
      helpText: "The AEM component type to fetch",
      default: DEFAULT_COMPONENT_TYPE,
    },
  },
  parameters: [
    {
      key: "component",
      value: "${component}",
    },
  ],
  custom: {
    componentType: DEFAULT_COMPONENT_TYPE,
  },
};

/**
 * AEM Content Fragment Type Editor
 * Configures which type of AEM content fragment to retrieve
 */
const AemContentFragmentTypeEditor: React.FC = () => {
  const { value, setValue } = useMeshLocation<
    "dataType",
    AemContentFragmentTypeConfig
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

  const handleChange = (componentType: string) => {
    setValue(() => ({
      newValue: {
        ...value,
        parameters: [
          {
            key: "component",
            value: componentType,
          },
        ],
        custom: {
          componentType,
        },
      },
    }));
  };

  const customSettings = value.custom;
  const componentType =
    (customSettings?.componentType as string) || DEFAULT_COMPONENT_TYPE;

  const selectedOption = AEM_COMPONENT_TYPES.find(
    (opt) => opt.value === componentType
  ) || { value: componentType, label: componentType };

  return (
    <VerticalRhythm style={{ minHeight: "300px" }}>
      <Label>AEM Component Type</Label>
      <InputComboBox
        name="componentType"
        id="componentType"
        onChange={(e) => handleChange(e.value)}
        options={AEM_COMPONENT_TYPES}
        value={selectedOption}
      />
      <Caption>
        Select the type of AEM content fragment to retrieve. This determines
        which component data structure will be fetched from AEM.
      </Caption>
    </VerticalRhythm>
  );
};

export default AemContentFragmentTypeEditor;

