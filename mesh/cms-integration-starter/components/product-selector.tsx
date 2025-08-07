import React, { useState, useEffect, useMemo } from "react";
import { VerticalRhythm, Button, InputComboBox } from "@uniformdev/design-system";
import {
  ObjectSearchProvider,
  ObjectSearchContainer,
  ObjectSearchListItem,
  InputKeywordSearch,
} from "@uniformdev/mesh-sdk-react";
import { Product } from "../types/product";

interface ProductSelectorProps {
  productList: Product[]; // List of Products to display
  selectedIds: string[]; // Identifiers of the selected Products
  onSelect: (products: Product | Product[]) => void; // Callback for when Products are selected
  multiSelect?: boolean; // Whether to allow multiple selections
  searchCriteria?: string; // What field to search on
  onSearch?: (query: string) => void; // Callback for search query changes
  onPageChange?: (page: number) => void; // Callback for page changes (deprecated)
  currentPage?: number; // Current page number (deprecated)
  enableLocaleFilter?: boolean; // Whether to show locale filter
  selectedLocale?: string; // Currently selected locale
  onLocaleChange?: (locale: string) => void; // Callback for locale changes
  availableLocales?: string[]; // List of available locales
  thumbnailImageAttribute?: string; // Which image attribute to use for thumbnails
  // New props for enhanced functionality
  allCategories?: string[]; // All available categories from Akeneo
  onLoadMore?: () => void; // Callback for load more button
  hasMoreProducts?: boolean; // Whether there are more products to load
  isLoadingMore?: boolean; // Whether currently loading more products
  searchQuery?: string; // Current search query value
  onCategoryChange?: (categories: string[]) => void; // Callback for category filter changes
}

// ProductSelector component is used to select Products from a list of Products from Akeneo PIM.
// It displays a search input field to filter the list of Products by name/identifier.
// The user can select one or multiple Products from the filtered list.
// Selected Products are highlighted in the list.
// The component supports both single and multi-select modes.

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  productList = [],
  selectedIds = [],
  onSelect,
  multiSelect = false,
  searchCriteria = "identifier",
  onSearch,
  onPageChange,
  currentPage = 1,
  enableLocaleFilter = false,
  selectedLocale = "en_US",
  onLocaleChange,
  availableLocales = ["en_US", "fr_FR", "de_DE", "es_ES", "it_IT"],
  thumbnailImageAttribute = "image_1",
  // New enhanced props
  allCategories = [],
  onLoadMore,
  hasMoreProducts = false,
  isLoadingMore = false,
  searchQuery = "",
  onCategoryChange,
}) => {
  const [filteredProductList, setFilteredProductList] = useState<Product[]>([]);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Use all categories from Akeneo API or extract from current products as fallback
  const availableCategories = useMemo(() => {
    if (allCategories.length > 0) {
      return allCategories.sort();
    }
    // Fallback: extract from current product list
    const categorySet = new Set<string>();
    productList.forEach(product => {
      product.categories.forEach(category => {
        if (category && category.trim()) {
          categorySet.add(category.trim());
        }
      });
    });
    return Array.from(categorySet).sort();
  }, [allCategories, productList]);

  // Create filter options for categories without counts
  const categoryFilterOptions = useMemo(() => {
    return availableCategories.map(category => ({
      value: category,
      label: category
    }));
  }, [availableCategories]);

  // Convert selected category values to option objects for the InputComboBox
  const selectedCategoryOptions = useMemo(() => {
    return selectedCategories.map(category => {
      const option = categoryFilterOptions.find(opt => opt.value === category);
      return option || { value: category, label: category };
    });
  }, [selectedCategories, categoryFilterOptions]);

  useEffect(() => {
    applyFilters(searchQuery, selectedCategories);
  }, [productList]);

  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  const applyFilters = (searchQuery: string, categoryFilters: string[]) => {
    if (onSearch) {
      onSearch(searchQuery);
      return;
    }

    // Local filtering if no onSearch callback provided
    let results = productList;

    // Apply category filter - show products that match ANY of the selected categories
    if (categoryFilters.length > 0) {
      results = results.filter((product) =>
        categoryFilters.some(category => product.categories.includes(category))
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      results = results
        .filter((product) => {
          const searchableValue = searchCriteria === "identifier"
            ? product.identifier
            : product.title;
          return searchableValue.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          const valueA = searchCriteria === "identifier" ? a.identifier : a.title;
          const valueB = searchCriteria === "identifier" ? b.identifier : b.title;

          // Prioritize names starting with the query
          const startsWithA = valueA
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
          const startsWithB = valueB
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;
          return valueA.localeCompare(valueB);
        });
    }

    setFilteredProductList(results);
  };

  const handleSearchTextChanged = (query: string) => {
    if (onSearch) {
      onSearch(query); // Use server-side search
    } else {
      // Fallback to client-side filtering if no onSearch provided
      applyFilters(query, selectedCategories);
    }
  };

  const handleCategoryChange = (newValue: readonly { value: string; label: string }[] | null, actionMeta?: any) => {
    const selectedOptions = newValue ? Array.from(newValue) : [];
    // Extract category values from the selected options
    const categories = selectedOptions.map(option => option.value);
    setSelectedCategories(categories);
    
    // Notify parent component if callback is provided (for server-side filtering)
    if (onCategoryChange) {
      onCategoryChange(categories);
    } else {
      // Fallback to local filtering if no callback provided
      applyFilters(searchQuery, categories);
    }
  };

  const handleObjectSelect = (id: string) => {
    const product = productList.find(p => p.identifier === id);
    if (!product) return;

    if (multiSelect) {
      const newSelectedIds = localSelectedIds.includes(product.identifier)
        ? localSelectedIds.filter(selectId => selectId !== product.identifier)
        : [...localSelectedIds, product.identifier];

      setLocalSelectedIds(newSelectedIds);

      const selectedProducts = productList.filter(p =>
        newSelectedIds.includes(p.identifier)
      );
      onSelect(selectedProducts);
    } else {
      onSelect(product);
    }
  };

  const clearSelection = () => {
    setLocalSelectedIds([]);
    if (onSearch) {
      onSearch(""); // Clear server-side search
    }
    onSelect(multiSelect ? [] : {} as Product);
  };

  return (
    <ObjectSearchProvider>
      <VerticalRhythm>
        {/* Locale Filter */}
        {enableLocaleFilter && onLocaleChange && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by locale
            </label>
            <select
              value={selectedLocale}
              onChange={(e) => onLocaleChange(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {availableLocales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selection Summary */}
        {multiSelect && localSelectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded mb-4">
            <span className="text-sm text-blue-700">
              {localSelectedIds.length} product{localSelectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              onClick={clearSelection}
              variant="soft"
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Category Filter (placed above search) */}
        {availableCategories.length > 0 && (
          <div className="mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refine by category
              </label>
              <InputComboBox
                placeholder="Select categories..."
                value={selectedCategoryOptions}
                onChange={handleCategoryChange}
                options={categoryFilterOptions}
                isMulti
                isSearchable
                isClearable
              />
            </div>
          </div>
        )}

        {/* Object Search Container */}
        <ObjectSearchContainer
          label="Search for products"
          searchFilters={
            <InputKeywordSearch
              onSearchTextChanged={handleSearchTextChanged}
              placeholder={`Search by ${searchCriteria}...`}
              value={searchQuery}
            />
          }
          resultList={
            filteredProductList.length > 0 ? (
              filteredProductList.map((product) => {
                return (
                  <ObjectSearchListItem
                    key={product.identifier}
                    id={product.identifier}
                    title={product.title}
                    contentType={`ID: ${product.identifier}`}
                    imageUrl={product.imageUrl}
                    onClick={() => handleObjectSelect(product.identifier)}
                    style={{
                      backgroundColor: localSelectedIds.includes(product.identifier) ? "#F0F8FF" : "transparent",
                      border: localSelectedIds.includes(product.identifier) ? "2px solid #007BFF" : "1px solid #e0e0e0",
                    }}
                    metadata={{
                      ...(product.family && { Family: product.family }),
                      ...(product.categories.length > 0 && {
                        Categories: product.categories.slice(0, 3).join(", ") +
                          (product.categories.length > 3 ? ` (+${product.categories.length - 3} more)` : "")
                      }),
                      ...(product.description && {
                        Description: product.description.length > 100
                          ? `${product.description.substring(0, 100)}...`
                          : product.description
                      }),
                      Status: product.enabled ? "✓ Enabled" : "✗ Disabled",
                    }}
                  />
                )
              })
            ) : (
              [
                <div key="empty" style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                  No products found
                </div>
              ]
            )
          }
        />

        {/* Load More */}
        {onLoadMore && hasMoreProducts && (
          <div className="flex items-center justify-center mt-4 p-3">
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              variant="soft"
            >
              {isLoadingMore ? "Loading..." : "Load More Products"}
            </Button>
          </div>
        )}

        {/* Legacy Pagination (for backward compatibility) */}
        {onPageChange && !onLoadMore && (
          <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-md">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="soft"
            >
              ← Previous
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600">
                Page {currentPage}
              </span>
              <span className="text-xs text-gray-500">
                Showing 10 products per page
              </span>
            </div>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              variant="soft"
              disabled={filteredProductList.length < 10}
            >
              Next →
            </Button>
          </div>
        )}
      </VerticalRhythm>
    </ObjectSearchProvider>
  );
};

export default ProductSelector;