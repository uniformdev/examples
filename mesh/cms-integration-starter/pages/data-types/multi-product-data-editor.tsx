import React, { useState } from "react";
import { useMeshLocation, LoadingOverlay, ObjectSearchResultItem } from "@uniformdev/mesh-sdk-react";
import { ProductSelector } from "../../components/product-selector";
import { useAsync } from "react-use";
import { ErrorCallout } from "../../components/error-callout";
import { MultiProductTypeConfig } from "./multi-product-type-editor";
import { AkeneoProductsResponse, transformAkeneoProduct } from "../../types/product";
import { VerticalRhythm } from "@uniformdev/design-system";

// This component is used to select multiple products from the Akeneo PIM data source.
// It is shown when the user is prompted to select multiple products from the data source.

const MultiProductDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as MultiProductTypeConfig;
  const searchCriteria = custom?.custom?.searchCriteria || "identifier";
  const enabledOnly = custom?.custom?.enabledOnly ?? true;
  const defaultLimit = custom?.custom?.limit || 100;
  const enableLocaleFilter = custom?.custom?.enableLocaleFilter || false;
  const defaultLocale = custom?.custom?.defaultLocale || "en_US";
  const attributes = custom?.custom?.attributes || [];
  const thumbnailImageAttribute = custom?.custom?.thumbnailImageAttribute || "image_1";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const identifiers = Array.isArray(value?.identifiers) ? value.identifiers : [];
  const selectedLocale = value?.locale || defaultLocale;

  const {
    value: productList = [],
    loading: loadingProducts,
    error: productError,
  } = useAsync(async () => {
    try {
      const params = [
        { key: "limit", value: "20" },
        { key: "page", value: currentPage.toString() },
      ];

      // Add specific attributes if configured
      if (attributes.length > 0) {
        params.push({ key: "attributes", value: attributes.join(",") });
      }

      // Add search parameters if search query is provided
      if (searchQuery.trim()) {
        params.push({ key: "search", value: searchQuery });
      }

      // Add locale parameter if locale filtering is enabled
      if (enableLocaleFilter && selectedLocale) {
        params.push({ key: "locales", value: selectedLocale });
      }

      const response = await getDataResource<AkeneoProductsResponse>({
        method: "GET",
        path: "/products",
        parameters: params,
      });

      if (response?._embedded?.items) {
        let products = response._embedded.items;
        
        // Filter enabled products if enabledOnly is true
        if (enabledOnly) {
          products = products.filter(product => product.enabled);
        }
        
        // Get base URL from metadata for constructing image URLs
        const baseUrl = (metadata?.dataSource?.baseUrl || metadata?.dataSource?.customPublic?.apiUrl) as string | undefined;
        
        return products.map(product => 
          transformAkeneoProduct(product, enableLocaleFilter ? selectedLocale : null, baseUrl, thumbnailImageAttribute)
        );
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [currentPage, searchQuery, enabledOnly, defaultLimit, metadata, searchCriteria, enableLocaleFilter, selectedLocale, attributes]);

  if (loadingProducts) {
    return <LoadingOverlay isActive />;
  }

  if (productError) {
    return <ErrorCallout error={productError.message} />;
  }

  // Find the selected products from the list
  const selectedProducts = identifiers.map(id => productList.find(p => p.identifier === id)).filter(Boolean);

  // If products are selected, show the result items instead of the selector
  if (selectedProducts.length > 0) {
    return (
      <VerticalRhythm>
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={() => {
              setValue((current) => ({
                ...current,
                newValue: {
                  ...current,
                  identifiers: [],
                  ...(enableLocaleFilter && { locale: selectedLocale }),
                } as any,
              }));
            }}
            style={{
              padding: "8px 16px",
              background: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ← Back to Product Selection
          </button>
          <span style={{ marginLeft: "16px", color: "#666" }}>
            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        {selectedProducts.map((product, index) => (
          <ObjectSearchResultItem
            key={product.identifier}
            id={product.identifier}
            createdAt={new Date()}
            onClick={() => {
              // Optional: Could implement edit/view functionality
            }}
            onRemove={() => {
              // Remove this specific product
              const newIdentifiers = identifiers.filter(id => id !== product.identifier);
              setValue((current) => ({
                ...current,
                newValue: {
                  ...current,
                  identifiers: newIdentifiers,
                  ...(enableLocaleFilter && { locale: selectedLocale }),
                } as any,
              }));
            }}
            popoverData={
              <>
                <p><strong>ID:</strong> {product.identifier}</p>
                {product.family && <p><strong>Family:</strong> {product.family}</p>}
                {product.categories.length > 0 && (
                  <p><strong>Categories:</strong> {product.categories.slice(0, 3).join(", ")}</p>
                )}
                {product.description && (
                  <small>{product.description.substring(0, 100)}...</small>
                )}
              </>
            }
            publishStatus={{
              text: product.enabled ? 'enabled' : 'disabled'
            }}
            publishedAt={new Date()}
            contentType={`Product ${index + 1}`}
            title={product.title}
          />
        ))}
      </VerticalRhythm>
    );
  }

  // Show the product selector when no products are selected
  return (
    <ProductSelector
      productList={productList || []}
      selectedIds={identifiers}
      onSelect={(selectedProducts) => {
        const selectedIdentifiers = Array.isArray(selectedProducts) 
          ? selectedProducts.map(p => p.identifier)
          : [selectedProducts.identifier];

        setValue((current) => ({
          ...current,
          newValue: {
            ...current,
            identifiers: selectedIdentifiers,
            ...(enableLocaleFilter && { locale: selectedLocale }),
          } as any,
        }));
      }}
      multiSelect={true}
      searchCriteria={searchCriteria}
      onSearch={setSearchQuery}
      onPageChange={setCurrentPage}
      currentPage={currentPage}
      enableLocaleFilter={enableLocaleFilter}
      selectedLocale={selectedLocale}
      onLocaleChange={enableLocaleFilter ? (locale) => {
        setValue((current) => ({
          ...current,
          newValue: {
            ...current,
            locale,
          } as any,
        }));
      } : undefined}
      thumbnailImageAttribute={thumbnailImageAttribute}
    />
  );
};

export default MultiProductDataEditorPage;