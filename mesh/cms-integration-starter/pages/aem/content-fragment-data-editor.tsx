import React, { useCallback, useEffect, useState } from "react";
import {
  useMeshLocation,
  LoadingOverlay,
  ObjectSearchContainer,
  ObjectSearchFilter,
  ObjectSearchListItem,
  ObjectSearchListItemLoadingSkeleton,
  ObjectSearchProvider,
  useObjectSearchContext,
} from "@uniformdev/mesh-sdk-react";
import { Callout } from "@uniformdev/design-system";
import { AemContentFragmentTypeConfig } from "./content-fragment-type-editor";

// AEM component types for the filter dropdown
const AEM_COMPONENT_OPTIONS = [
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

// Type for search result items
interface AemContentFragment {
  id: string;
  title: string;
  componentType: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Inner component that uses the ObjectSearch context
 */
const ContentFragmentSearchInner: React.FC<{
  defaultComponentType: string;
  onSelect: (fragment: AemContentFragment) => void;
  selectedId?: string;
}> = ({ defaultComponentType, onSelect, selectedId }) => {
  const { query } = useObjectSearchContext();
  const [fragments, setFragments] = useState<AemContentFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use contentType from context if available, otherwise fall back to default
  const activeComponentType = query?.contentType || defaultComponentType;

  // Fetch fragments based on component type and search query
  const fetchFragments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build the API URL with query parameters
      const params = new URLSearchParams();
      if (activeComponentType) {
        params.set("component", activeComponentType);
      }
      if (query?.keyword) {
        params.set("search", query.keyword);
      }

      const url = `/api/aem/content?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch content fragments: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform AEM data to our fragment format
      const transformedFragments = transformAemResponse(data, activeComponentType);
      setFragments(transformedFragments);
    } catch (err) {
      console.error("[alex] Error fetching AEM content fragments:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [activeComponentType, query?.keyword]);

  useEffect(() => {
    fetchFragments();
  }, [fetchFragments]);

  if (error) {
    return (
      <Callout type="error">
        {error}
      </Callout>
    );
  }

  return (
    <ObjectSearchContainer
      label="Select AEM Content Fragment"
      searchFilters={
        <ObjectSearchFilter
          selectLabel="Component Type"
          selectOptions={AEM_COMPONENT_OPTIONS}
          searchInputPlaceholderText="Search content fragments..."
        />
      }
      resultList={
        loading ? (
          <>
            <ObjectSearchListItemLoadingSkeleton />
            <ObjectSearchListItemLoadingSkeleton />
            <ObjectSearchListItemLoadingSkeleton />
          </>
        ) : fragments.length > 0 ? (
          fragments.map((fragment) => (
            <ObjectSearchListItem
              key={fragment.id}
              id={fragment.id}
              title={fragment.title}
              contentType={fragment.componentType}
              imageUrl={fragment.imageUrl}
              onSelect={() => onSelect(fragment)}
              popoverData={
                fragment.description ? (
                  <div style={{ padding: "8px", maxWidth: "300px" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                      {fragment.description}
                    </p>
                  </div>
                ) : undefined
              }
            />
          ))
        ) : (
          <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
            No content fragments found
          </div>
        )
      }
    />
  );
};

/**
 * Transform AEM API response to our fragment format
 */
function transformAemResponse(
  data: Record<string, unknown>,
  componentType: string
): AemContentFragment[] {
  const fragments: AemContentFragment[] = [];

  // Handle full page content with :items
  if (data[":items"]) {
    const items = data[":items"] as Record<string, unknown>;
    for (const [key, value] of Object.entries(items)) {
      const item = value as Record<string, unknown>;
      fragments.push(createFragmentFromItem(key, item));
    }
    return fragments;
  }

  // Handle single component response
  if (data[":type"]) {
    fragments.push(createFragmentFromItem(componentType, data));
    return fragments;
  }

  // Handle items array (for components with items/cards)
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      fragments.push(
        createFragmentFromItem(`${componentType}-${index}`, item as Record<string, unknown>)
      );
    });
    return fragments;
  }

  return fragments;
}

/**
 * Create a fragment object from an AEM item
 */
function createFragmentFromItem(
  id: string,
  item: Record<string, unknown>
): AemContentFragment {
  const type = (item[":type"] as string) || id;
  const typeParts = type.split("/");
  const componentName = typeParts[typeParts.length - 1];

  // Extract title from various possible fields
  const title =
    (item.headline as string) ||
    (item.title as string) ||
    (item.sectionTitle as string) ||
    (item.label as string) ||
    (item.eyebrowText as string) ||
    formatComponentName(componentName);

  // Extract description
  const description =
    (item.bodyText as string) ||
    (item.description as string) ||
    (item.sectionDescription as string);

  // Extract image URL
  const imageUrl =
    (item.backgroundImageDesktop as string) ||
    (item.imageUrl as string) ||
    (item.iconUrl as string);

  return {
    id,
    title,
    componentType: formatComponentName(componentName),
    description: description?.slice(0, 150) + (description && description.length > 150 ? "..." : ""),
    imageUrl,
  };
}

/**
 * Format component name for display
 */
function formatComponentName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * AEM Content Fragment Data Editor
 * Visual picker for selecting AEM content fragments using Uniform's ObjectSearch UI
 */
const AemContentFragmentDataEditor: React.FC = () => {
  const { value, metadata, setValue } = useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as AemContentFragmentTypeConfig;
  const componentType = custom?.custom?.componentType || "herobanner";

  const selectedId = value?.fragmentId as string | undefined;

  // Get currently selected item for the provider
  const currentlySelectedItems = selectedId
    ? [
        {
          id: selectedId,
          title: (value?.fragmentTitle as string) || selectedId,
          contentType: componentType,
        },
      ]
    : [];

  const handleSelect = useCallback(
    (fragment: AemContentFragment) => {
      setValue(() => ({
        newValue: {
          fragmentId: fragment.id,
          fragmentTitle: fragment.title,
          componentType: fragment.componentType,
        },
      }));
    },
    [setValue]
  );

  if (!metadata) {
    return <LoadingOverlay isActive />;
  }

  return (
    <ObjectSearchProvider 
      currentlySelectedItems={currentlySelectedItems}
      defaultQuery={{ contentType: componentType }}
    >
      <ContentFragmentSearchInner
        defaultComponentType={componentType}
        onSelect={handleSelect}
        selectedId={selectedId}
      />
    </ObjectSearchProvider>
  );
};

export default AemContentFragmentDataEditor;

