import React from "react";
import { useMeshLocation, LoadingOverlay } from "@uniformdev/mesh-sdk-react";
import { ProductSelector } from "../../components/product-selector";
import { useAsync } from "react-use";
import { ErrorCallout } from "../../components/error-callout";
import { IntegrationTypeConfig } from "./single-product-type-editor";
import { AkeneoProductsResponse, Product } from "../../types/product";

// Helper function to transform Akeneo product to simplified Product
const transformAkeneoProduct = (akeneoProduct: any): Product => {
  // Get the first available name/label value
  const getName = () => {
    if (akeneoProduct.values?.name) {
      const nameValue = akeneoProduct.values.name.find((v: any) => v.data);
      if (nameValue) return nameValue.data;
    }
    if (akeneoProduct.values?.label) {
      const labelValue = akeneoProduct.values.label.find((v: any) => v.data);
      if (labelValue) return labelValue.data;
    }
    return akeneoProduct.identifier;
  };

  // Get description
  const getDescription = () => {
    if (akeneoProduct.values?.description) {
      const descValue = akeneoProduct.values.description.find((v: any) => v.data);
      if (descValue) return descValue.data;
    }
    return "";
  };

  // Get image URL
  const getImageUrl = () => {
    if (akeneoProduct.values?.image) {
      const imageValue = akeneoProduct.values.image.find((v: any) => v.data);
      if (imageValue) return imageValue.data;
    }
    return "";
  };

  return {
    identifier: akeneoProduct.identifier,
    title: getName(),
    description: getDescription(),
    family: akeneoProduct.family,
    enabled: akeneoProduct.enabled,
    categories: akeneoProduct.categories || [],
    imageUrl: getImageUrl(),
  };
};

// This component is used to select a single product from the Akeneo PIM data source.
// It is shown when the user is prompted to select a single product from the data source.

const SingleProductDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as IntegrationTypeConfig;
  const searchCriteria = custom?.custom?.searchCriteria || "identifier";
  const enableLocaleFilter = custom?.custom?.enableLocaleFilter || false;
  const defaultLocale = custom?.custom?.defaultLocale || "en_US";

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
        { key: "limit", value: "100" },
        { key: "page", value: "1" },
      ];

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
        return response._embedded.items.map(transformAkeneoProduct);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [metadata, enableLocaleFilter, selectedLocale]);

  const selectedIds = identifier ? [identifier] : [];

  if (loadingProducts) {
    return <LoadingOverlay isActive />;
  }

  if (productError) {
    return <ErrorCallout error={productError.message} />;
  }

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
    />
  );
};

export default SingleProductDataEditorPage;