import React, { useState, useEffect, useMemo } from "react";
import { VerticalRhythm, Button, InputComboBox } from "@uniformdev/design-system";
import {
  ObjectSearchProvider,
  ObjectSearchContainer,
  ObjectSearchListItem,
  InputKeywordSearch,
} from "@uniformdev/mesh-sdk-react";
import { Product, transformAkeneoProduct } from "../types/product";

interface CategoryData {
  code: string;
  labels: Record<string, string>;
  parent: string | null;
  label: string;
}

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
  allCategories?: CategoryData[]; // All available categories with hierarchy from Akeneo
  onLoadMore?: () => void; // Callback for load more button
  hasMoreProducts?: boolean; // Whether there are more products to load
  isLoadingMore?: boolean; // Whether currently loading more products
  searchQuery?: string; // Current search query value
  onCategoryChange?: (categories: string[]) => void; // Callback for category filter changes
  // Server-side search props
  enableServerSearch?: boolean; // Whether to use server-side search
  getDataResource?: any; // The getDataResource function from useMeshLocation
  baseUrl?: string; // Base URL for transformations
  onServerSearchResults?: (results: Product[], hasMore: boolean) => void; // Callback for server search results
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
  // Server-side search props
  enableServerSearch = false,
  getDataResource,
  baseUrl,
  onServerSearchResults,
}) => {
  const [filteredProductList, setFilteredProductList] = useState<Product[]>([]);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Build hierarchical category options with grouping
  const categoryFilterOptions = useMemo(() => {
    
    if (!allCategories || allCategories.length === 0) {
      // Fallback: extract from current product list and simulate hierarchy
      const categorySet = new Set<string>();
      productList.forEach(product => {
        product.categories.forEach(category => {
          if (category && category.trim() && !category.toLowerCase().includes('master')) {
            categorySet.add(category.trim());
          }
        });
      });
      
      const categoryList = Array.from(categorySet).sort();
      
      // If we have categories, try to create a simulated hierarchical structure
      if (categoryList.length > 0) {
        // Group categories by common prefixes or manually group known patterns
        const groupedFallback: any[] = [];
        const ungrouped: string[] = [];
        const groups: { [key: string]: string[] } = {};
        
        // Try to group by common patterns
        categoryList.forEach(category => {
          // Look for patterns like "master_clothing_footwear_workwear"
          const parts = category.split('_');
          if (parts.length >= 3) {
            // Use first 2-3 parts as group name
            const groupKey = parts.slice(0, 3).join('_');
            const groupLabel = parts.slice(0, 3).join(' ').replace(/master\s*/i, '').trim();
            
            if (!groups[groupKey]) {
              groups[groupKey] = [];
            }
            groups[groupKey].push(category);
          } else {
            ungrouped.push(category);
          }
        });
        
        // Add ungrouped items first
        ungrouped.forEach(category => {
          groupedFallback.push({
            value: category,
            label: category.replace(/master[_\s]*/i, '').replace(/_/g, ' '),
            indented: true
          });
        });
        
        // Add grouped items
        Object.entries(groups).forEach(([groupKey, items]) => {
          if (items.length > 1) {
            // Create a group
            const groupLabel = groupKey.replace(/master[_\s]*/i, '').replace(/_/g, ' ');
            groupedFallback.push({
              label: groupLabel,
              options: items.map(item => ({
                value: item,
                label: item.replace(/master[_\s]*/i, '').replace(/_/g, ' ')
              }))
            });
          } else {
            // Single item, add as ungrouped
            items.forEach(item => {
              groupedFallback.push({
                value: item,
                label: item.replace(/master[_\s]*/i, '').replace(/_/g, ' '),
                indented: true
              });
            });
          }
        });
        
        return groupedFallback;
      }
      
      // Final fallback to simple flat structure
      return categoryList.map(category => ({
        value: category,
        label: category
      }));
    }

    // Build category hierarchy map
    const categoryMap = new Map<string, CategoryData>();
    const rootCategories: CategoryData[] = [];
    const childrenMap = new Map<string, CategoryData[]>();

    // First pass: populate maps
    allCategories.forEach(category => {
      categoryMap.set(category.code, category);
      if (!category.parent) {
        rootCategories.push(category);
      } else {
        if (!childrenMap.has(category.parent)) {
          childrenMap.set(category.parent, []);
        }
        childrenMap.get(category.parent)!.push(category);
      }
    });



    // Build grouped options
    const groupedOptions: any[] = [];
    
    // Add ungrouped (root) categories first
    const ungroupedRoots = rootCategories.filter(cat => !childrenMap.has(cat.code));
    ungroupedRoots.forEach(category => {
      groupedOptions.push({
        value: category.code,
        label: category.label,
        indented: true
      });
    });

    // Add root categories with children as groups
    const groupedRoots = rootCategories.filter(cat => childrenMap.has(cat.code));
    groupedRoots.forEach(rootCategory => {
      const children = childrenMap.get(rootCategory.code) || [];
      if (children.length > 0) {
        groupedOptions.push({
          label: rootCategory.label,
          options: children.map(child => ({
            value: child.code,
            label: child.label
          }))
        });
      }
    });

    return groupedOptions;
  }, [allCategories, productList]);

  // Convert selected category values to option objects for the InputComboBox
  const selectedCategoryOptions = useMemo(() => {
    return selectedCategories.map(category => {
      // Find option in flat list or nested groups
      let option = categoryFilterOptions.find(opt => opt.value === category);
      
      if (!option) {
        // Search in nested groups
        for (const group of categoryFilterOptions) {
          if (group.options) {
            option = group.options.find((opt: any) => opt.value === category);
            if (option) break;
          }
        }
      }
      
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

  const performServerSearch = async (query: string, categories: string[] = selectedCategories) => {
    console.log('🔍 Server search debug:', {
      enableServerSearch,
      hasGetDataResource: !!getDataResource,
      hasBaseUrl: !!baseUrl,
      query,
      categories
    });
    
    if (!enableServerSearch || !getDataResource) {
      console.log('❌ Server search disabled or missing getDataResource:', {
        enableServerSearch,
        hasGetDataResource: !!getDataResource
      });
      return false; // Fall back to client-side search
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      // Build search parameters using Akeneo API search format
      const params = [
        { key: "limit", value: "20" },
        { key: "page", value: "1" },
      ];

      // Build search criteria
      const searchCriteriaObj: any = {};
      
      if (query?.trim()) {
        const searchTerm = query.trim();
        console.log('🔍 Building search criteria for description/name:', { searchTerm });
        
        // Use description and name fields with text search operators
        // These fields support STARTS_WITH and CONTAINS operators properly
        const searchFields: any = {};
        
        // Search in description field with CONTAINS for broader matching
        searchFields.description = [{
          operator: "CONTAINS",
          value: searchTerm,
          scope: "ecommerce" // Use ecommerce scope as default
        }];
       
        Object.assign(searchCriteriaObj, searchFields);
        console.log('🔍 Using description/name search with multiple fields:', searchFields);
      }
      
      if (categories.length > 0) {
        searchCriteriaObj.categories = [{ operator: "IN", value: categories }];
      }
      
      // Add search criteria if any exist
      if (Object.keys(searchCriteriaObj).length > 0) {
        params.push({ 
          key: "search", 
          value: JSON.stringify(searchCriteriaObj)
        });
      }

      // Add locale parameter using search_locale format for better search support
      if (enableLocaleFilter && selectedLocale) {
        params.push({ key: "search_locale", value: selectedLocale });
      }

      console.log('🔍 Calling getDataResource with params:', params);

      const response = await getDataResource({
        method: "GET",
        path: "/products",
        parameters: params,
      });

      console.log('🔍 Server search response:', response);
      
      if (response?._embedded?.items) {
        // Transform the results using the proper transformation function
        const transformedProducts = response._embedded.items.map((item: any) =>
          transformAkeneoProduct(
            item,
            enableLocaleFilter ? selectedLocale : null,
            baseUrl || '',
            thumbnailImageAttribute
          )
        );

        console.log('🔍 Transformed products:', transformedProducts.length);

        setFilteredProductList(transformedProducts);

        if (onServerSearchResults) {
          onServerSearchResults(transformedProducts, response._embedded.items.length >= 20);
        }

        return true;
      }

      setFilteredProductList([]);
      return true;
    } catch (error) {
      console.error('Server search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Search failed');
      return false; // Fall back to client-side search
    } finally {
      setIsSearching(false);
    }
  };

    const performDebouncedSearch = async (query: string) => {
    // For text-based search, always try server-side first if enabled
    // Description/name fields support proper text search operators
    if (enableServerSearch && query.trim().length > 0) {
      const serverSearchSuccessful = await performServerSearch(query, selectedCategories);
      if (serverSearchSuccessful) {
        return; // Server search handled it
      }
    }

    // Fall back to original logic
    if (onSearch) {
      onSearch(query); // Use existing callback-based search
    } else {
      // Fallback to client-side filtering if no onSearch provided
      applyFilters(query, selectedCategories);
    }
  };

  const handleSearchTextChanged = (query: string) => {
    // Update internal search state immediately for UI responsiveness
    setInternalSearchQuery(query);
    
    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set up debounced search (wait 300ms after user stops typing)
    const timer = setTimeout(() => {
      performDebouncedSearch(query);
    }, 500);
    
    setSearchDebounceTimer(timer);
  };

  const handleCategoryChange = async (newValue: readonly { value: string; label: string }[] | null, actionMeta?: any) => {
    const selectedOptions = newValue ? Array.from(newValue) : [];
    // Extract category values from the selected options
    const categories = selectedOptions.map(option => option.value);
    setSelectedCategories(categories);

    // Try server-side search first if enabled
    if (enableServerSearch && internalSearchQuery) {
      const serverSearchSuccessful = await performServerSearch(internalSearchQuery, categories);
      if (serverSearchSuccessful) {
        return; // Server search handled it
      }
    }

    // Notify parent component if callback is provided (for server-side filtering)
    if (onCategoryChange) {
      onCategoryChange(categories);
    } else {
      // Fallback to local filtering if no callback provided
      applyFilters(internalSearchQuery, categories);
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
    setInternalSearchQuery(""); // Clear internal search query
    
    // Clear any pending search timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      setSearchDebounceTimer(null);
    }
    
    if (onSearch) {
      onSearch(""); // Clear server-side search
    }
    onSelect(multiSelect ? [] : {} as Product);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

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
        {categoryFilterOptions.length > 0 && (
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

        {/* Search Error Display */}
        {searchError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-700 text-sm">
              <strong>Search Error:</strong> {searchError}
            </div>
            <div className="text-red-600 text-xs mt-1">
              Falling back to local search...
            </div>
          </div>
        )}

        {/* Object Search Container */}
        <ObjectSearchContainer
          label={`Search for products`}
          searchFilters={
            <div className="relative">
              <InputKeywordSearch
                onSearchTextChanged={handleSearchTextChanged}
                placeholder="Search products by name or description..."
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
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