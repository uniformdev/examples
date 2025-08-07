import React from "react";
import { useMeshLocation, LoadingOverlay, ObjectSearchResultItem } from "@uniformdev/mesh-sdk-react";
import { ProductSelector } from "../../components/product-selector";
import { useAsync } from "react-use";
import { ErrorCallout } from "../../components/error-callout";
import { IntegrationTypeConfig } from "./single-product-type-editor";
import { AkeneoProductsResponse, transformAkeneoProduct } from "../../types/product";

// This component is used to select a single product from the Akeneo PIM data source.
// It is shown when the user is prompted to select a single product from the data source.

const SingleProductDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as IntegrationTypeConfig;
  const searchCriteria = custom?.custom?.searchCriteria || "identifier";
  const enableLocaleFilter = custom?.custom?.enableLocaleFilter || false;
  const defaultLocale = custom?.custom?.defaultLocale || "en_US";
  const attributes = custom?.custom?.attributes || [];
  const thumbnailImageAttribute = custom?.custom?.thumbnailImageAttribute || "image_1";

  const identifier = value?.identifier;
  const selectedLocale = value?.locale || defaultLocale;

  const {
    value: productList = [],
    loading: loadingProducts,
    error: productError,
  } = useAsync(async () => {
    try {
      // Fetch the product list for selection UI
      // The actual data consumption uses the configured path with variables
      const params = [
        { key: "limit", value: "20" },
        { key: "page", value: "1" },
      ];

      // Add specific attributes if configured
      if (attributes.length > 0) {
        params.push({ key: "attributes", value: attributes.join(",") });
      }

      // Add locale parameter if locale filtering is enabled
      if (enableLocaleFilter && selectedLocale) {
        params.push({ key: "locales", value: selectedLocale });
      }

      console.log({ params, attributes });

      const response = await getDataResource<AkeneoProductsResponse>({
        method: "GET",
        path: "/products",
        parameters: params,
      });

      if (response?._embedded?.items) {
        // Get base URL from metadata for constructing image URLs
        const baseUrl = (metadata?.dataSource?.baseUrl || metadata?.dataSource?.customPublic?.apiUrl) as string | undefined;
        
        return response._embedded.items.map(product => 
          transformAkeneoProduct(product, enableLocaleFilter ? selectedLocale : null, baseUrl, thumbnailImageAttribute)
        );
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [metadata, enableLocaleFilter, selectedLocale, attributes]);

  const selectedIds = identifier ? [identifier] : [];

  if (loadingProducts) {
    return <LoadingOverlay isActive />;
  }

  if (productError) {
    return <ErrorCallout error={productError.message} />;
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
    />
  );
};

export default SingleProductDataEditorPage;