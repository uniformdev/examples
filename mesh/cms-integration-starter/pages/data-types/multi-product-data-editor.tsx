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

  // Memoize configuration values to prevent unnecessary re-renders
  const config = React.useMemo(() => {
    const custom = metadata.dataType as unknown as MultiProductTypeConfig;
    return {
      searchCriteria: custom?.custom?.searchCriteria || "identifier",
      enabledOnly: custom?.custom?.enabledOnly ?? true,
      defaultLimit: custom?.custom?.limit || 100,
      enableLocaleFilter: custom?.custom?.enableLocaleFilter || false,
      defaultLocale: custom?.custom?.defaultLocale || "en_US",
      attributes: custom?.custom?.attributes || [],
      thumbnailImageAttribute: custom?.custom?.thumbnailImageAttribute || "image_1",
    };
  }, [metadata.dataType]);

  const { searchCriteria, enabledOnly, defaultLimit, enableLocaleFilter, defaultLocale, attributes, thumbnailImageAttribute } = config;

  const [loadedProducts, setLoadedProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  // Memoize the setHasMoreProducts function to prevent recreating it
  const updateHasMoreProducts = React.useCallback((hasMore: boolean) => {
    setHasMoreProducts(hasMore);
  }, []);

  const identifiers = Array.isArray(value?.identifiers) ? value.identifiers : [];
  const selectedLocale = value?.locale || defaultLocale;

  // Fetch categories separately
  const {
    value: categories = [],
    loading: loadingCategories,
  } = useAsync(async () => {
    try {
      const response = await getDataResource({
        method: "GET",
        path: "/categories",
        parameters: [
          { key: "limit", value: "100" },
        ],
      });

      if ((response as any)?._embedded?.items) {
        return (response as any)._embedded.items.map((cat: any) => cat.code);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }, [metadata]);

  // Memoize the base URL to prevent metadata from causing re-renders
  const baseUrl = React.useMemo(() => {
    return (metadata?.dataSource?.baseUrl || metadata?.dataSource?.customPublic?.apiUrl) as string | undefined;
  }, [metadata?.dataSource?.baseUrl, metadata?.dataSource?.customPublic?.apiUrl]);

  // Memoize the async function to prevent unnecessary re-creation
  const fetchProducts = React.useCallback(async () => {
    try {
      const params = [
        { key: "limit", value: "10" },
        { key: "page", value: currentPage.toString() },
      ];

      // Add specific attributes if configured
      if (attributes.length > 0) {
        params.push({ key: "attributes", value: attributes.join(",") });
      }

      // Build search criteria combining text search and category filters
      const searchCriteria: any = {};
      
      if (searchQuery.trim()) {
        searchCriteria.identifier = [{ operator: "CONTAINS", value: searchQuery.trim() }];
      }
      
      if (selectedCategories.length > 0) {
        searchCriteria.categories = [{ operator: "IN", value: selectedCategories }];
      }
      
      // Add combined search parameter if any criteria exist
      if (Object.keys(searchCriteria).length > 0) {
        params.push({ 
          key: "search", 
          value: JSON.stringify(searchCriteria)
        });
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
        
        const transformedProducts = products.map(product => 
          transformAkeneoProduct(product, enableLocaleFilter ? selectedLocale : null, baseUrl, thumbnailImageAttribute)
        );

        // Check if there are more products
        updateHasMoreProducts(transformedProducts.length === 10);
        
        return transformedProducts;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [getDataResource, currentPage, searchQuery, selectedCategories, enabledOnly, enableLocaleFilter, selectedLocale, attributes, baseUrl, thumbnailImageAttribute, updateHasMoreProducts]);

  const {
    value: productBatch = [],
    loading: loadingProducts,
    error: productError,
  } = useAsync(fetchProducts, [fetchProducts]);

  // Manage loaded products list
  React.useEffect(() => {
    if (productBatch && productBatch.length >= 0) {
      if (currentPage === 1 || searchQuery !== "") {
        // Reset for new search or first page
        setLoadedProducts(productBatch);
      } else {
        // Append for load more
        setLoadedProducts(prev => [...prev, ...productBatch]);
      }
    }
  }, [productBatch, currentPage, searchQuery]);

  const productList = loadedProducts;

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
      // New props for enhanced functionality
      allCategories={categories}
      onSearch={(query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
      }}
      onCategoryChange={(categories) => {
        setSelectedCategories(categories);
        setCurrentPage(1); // Reset to first page on category change
      }}
      onLoadMore={() => {
        if (hasMoreProducts && !loadingProducts) {
          setCurrentPage(prev => prev + 1);
        }
      }}
      hasMoreProducts={hasMoreProducts}
      isLoadingMore={loadingProducts}
      searchQuery={searchQuery}
    />
  );
};

export default MultiProductDataEditorPage;