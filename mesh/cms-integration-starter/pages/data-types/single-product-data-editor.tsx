import React from "react";
import { useMeshLocation, LoadingOverlay, ObjectSearchResultItem } from "@uniformdev/mesh-sdk-react";
import { ProductSelector } from "../../components/product-selector";
import { useAsync } from "react-use";
import { IntegrationTypeConfig } from "./single-product-type-editor";
import { AkeneoProductsResponse, transformAkeneoProduct } from "../../types/product";

// This component is used to select a single product from the Akeneo PIM data source.
// It is shown when the user is prompted to select a single product from the data source.

const SingleProductDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  // Memoize configuration values to prevent unnecessary re-renders
  const config = React.useMemo(() => {
    const custom = metadata.dataType as unknown as IntegrationTypeConfig;
    return {
      searchCriteria: custom?.custom?.searchCriteria || "identifier",
      enableLocaleFilter: custom?.custom?.enableLocaleFilter || false,
      defaultLocale: custom?.custom?.defaultLocale || "en_US",
      attributes: custom?.custom?.attributes || [],
      thumbnailImageAttribute: custom?.custom?.thumbnailImageAttribute || "image_1",
    };
  }, [metadata.dataType]);

  const { searchCriteria, enableLocaleFilter, defaultLocale, attributes, thumbnailImageAttribute } = config;

  const identifier = value?.identifier;
  const selectedLocale = value?.locale || defaultLocale;

  // State for products and category filtering
  const [loadedProducts, setLoadedProducts] = React.useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch categories with full data including labels and hierarchy
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
        const rawCategories = (response as any)._embedded.items;
        
        // Return full category objects with hierarchy info
        return rawCategories
          .filter((cat: any) => {
            // Filter out categories containing "master" in their code
            return !cat.code.toLowerCase().includes('master');
          })
          .map((cat: any) => ({
            code: cat.code,
            labels: cat.labels || {},
            parent: cat.parent,
            // Use label for current locale, fallback to code
            label: cat.labels?.en_US || cat.labels?.en || cat.labels?.[Object.keys(cat.labels)[0]] || cat.code
          }));
      }
      
      return [];
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      return [];
    }
  }, [metadata]);

  // Memoize the base URL for transformations
  const baseUrl = React.useMemo(() => {
    return (metadata?.dataSource?.baseUrl || metadata?.dataSource?.customPublic?.apiUrl) as string | undefined;
  }, [metadata?.dataSource?.baseUrl, metadata?.dataSource?.customPublic?.apiUrl]);

  // Manual fetch function that manages state directly
  const fetchProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build search parameters
      const params = [
        { key: "limit", value: "100" }, // Fetch more products for better client-side filtering
        { key: "page", value: "1" }, // Always fetch first page for simplicity
      ];

      // Add specific attributes if configured
      if (attributes.length > 0) {
        params.push({ key: "attributes", value: attributes.join(",") });
      }

      // Only add server-side category filtering if categories are selected
      if (selectedCategories.length > 0) {
        const searchCriteria = {
          categories: [{ operator: "IN", value: selectedCategories }]
        };
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
        const products = response._embedded.items.map(product => 
          transformAkeneoProduct(product, enableLocaleFilter ? selectedLocale : null, baseUrl, thumbnailImageAttribute)
        );

        setLoadedProducts(products);
      } else {
        setLoadedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoadedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [getDataResource, enableLocaleFilter, selectedLocale, attributes, selectedCategories, baseUrl, thumbnailImageAttribute]);

  // Trigger fetch when dependencies change
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productList = loadedProducts;

  const selectedIds = identifier ? [identifier] : [];

  if (isLoading && loadedProducts.length === 0) {
    return <LoadingOverlay isActive />;
  }

  // Find the selected product from the list
  const selectedProduct = identifier ? productList.find(p => p.identifier === identifier) : null;

  // If a product is selected, show the result item instead of the selector
  if (selectedProduct) {
    return (
      <ObjectSearchResultItem
        id={selectedProduct.identifier}
        createdAt={new Date()}
        imageUrl={selectedProduct.imageUrl}
        onClick={() => {
          // Clear selection to go back to selector
          setValue((current) => ({
            ...current,
            newValue: {
              identifier: undefined,
              ...(enableLocaleFilter && { locale: selectedLocale }),
            },
          }));
        }}
        onRemove={() => {
          // Clear selection
          setValue((current) => ({
            ...current,
            newValue: {
              identifier: undefined,
              ...(enableLocaleFilter && { locale: selectedLocale }),
            },
          }));
        }}
        popoverData={
          <>
            <p><strong>ID:</strong> {selectedProduct.identifier}</p>
            {selectedProduct.family && <p><strong>Family:</strong> {selectedProduct.family}</p>}
            {selectedProduct.categories.length > 0 && (
              <p><strong>Categories:</strong> {selectedProduct.categories.slice(0, 3).join(", ")}</p>
            )}
            {selectedProduct.description && (
              <small>{selectedProduct.description.substring(0, 100)}...</small>
            )}
          </>
        }
        publishStatus={{
          text: selectedProduct.enabled ? 'enabled' : 'disabled'
        }}
        publishedAt={new Date()}
        contentType="Product"
        title={selectedProduct.title}
      />
    );
  }

  console.log({ categories });
      // Show the product selector when no product is selected
  return (
    <ProductSelector
      productList={productList || []}
      selectedIds={selectedIds}
      onSelect={(selectedProduct) => {
        const product = Array.isArray(selectedProduct) ? selectedProduct[0] : selectedProduct;
        setValue((current) => ({
          ...current,
          newValue: {
            identifier: product.identifier,
            ...(enableLocaleFilter && { locale: selectedLocale }),
          },
        }));
      }}
      multiSelect={false}
      searchCriteria={searchCriteria}
      enableLocaleFilter={enableLocaleFilter}
      selectedLocale={selectedLocale}
      onLocaleChange={enableLocaleFilter ? (locale) => {
        setValue((current) => ({
          ...current,
          newValue: {
            ...current,
            locale,
          },
        }));
      } : undefined}
      thumbnailImageAttribute={thumbnailImageAttribute}
      // Enhanced functionality
      allCategories={categories}
      onCategoryChange={(categories) => {
        setSelectedCategories(categories);
      }}
      // Server-side search functionality
      enableServerSearch={true}
      getDataResource={getDataResource}
      baseUrl={baseUrl}
      onServerSearchResults={(results, hasMore) => {
        setLoadedProducts(results);
        // Note: You might want to handle pagination state here if needed
      }}
    />
  );
};

export default SingleProductDataEditorPage;