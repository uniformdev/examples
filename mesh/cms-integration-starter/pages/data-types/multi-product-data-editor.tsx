import React, { useState } from "react";
import { useMeshLocation, LoadingOverlay } from "@uniformdev/mesh-sdk-react";
import { ProductSelector } from "../../components/product-selector";
import { useAsync } from "react-use";
import { ErrorCallout } from "../../components/error-callout";
import { MultiProductTypeConfig } from "./multi-product-type-editor";
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

// This component is used to select multiple products from the Akeneo PIM data source.
// It is shown when the user is prompted to select multiple products from the data source.

const MultiProductDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as MultiProductTypeConfig;
  const searchCriteria = custom?.custom?.searchCriteria || "identifier";
  const enabledOnly = custom?.custom?.enabledOnly ?? true;
  const defaultLimit = custom?.custom?.limit || 100;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const identifiers = value?.identifiers || [];

  const {
    value: productList = [],
    loading: loadingProducts,
    error: productError,
  } = useAsync(async () => {
    try {
      console.log("Attempting to fetch products from Akeneo PIM (multi-select)...");
      console.log("Data source metadata:", metadata);
      console.log("Search criteria:", searchCriteria);
      
      const params = [
        { key: "limit", value: defaultLimit.toString() },
        { key: "page", value: currentPage.toString() },
      ];

      // Add search parameters if search query is provided
      if (searchQuery.trim()) {
        params.push({ key: "search", value: searchQuery });
      }

      console.log("Request parameters:", params);

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
        
        console.log(`Successfully fetched ${products.length} products (after filtering)`);
        return products.map(transformAkeneoProduct);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
      throw error;
    }
  }, [currentPage, searchQuery, enabledOnly, defaultLimit, metadata, searchCriteria]);

  if (loadingProducts) {
    return <LoadingOverlay isActive />;
  }

  if (productError) {
    return <ErrorCallout error={productError.message} />;
  }

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
            identifiers: selectedIdentifiers,
          },
        }));
      }}
      multiSelect={true}
      searchCriteria={searchCriteria}
      onSearch={setSearchQuery}
      onPageChange={setCurrentPage}
      currentPage={currentPage}
    />
  );
};

export default MultiProductDataEditorPage;