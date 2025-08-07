import React, { useState, useEffect } from "react";
import { VerticalRhythm, Input, Button } from "@uniformdev/design-system";
import { debounce } from "lodash";
import { Product } from "../types/product";

interface ProductSelectorProps {
  productList: Product[]; // List of Products to display
  selectedIds: string[]; // Identifiers of the selected Products
  onSelect: (products: Product | Product[]) => void; // Callback for when Products are selected
  multiSelect?: boolean; // Whether to allow multiple selections
  searchCriteria?: string; // What field to search on
  onSearch?: (query: string) => void; // Callback for search query changes
  onPageChange?: (page: number) => void; // Callback for page changes
  currentPage?: number; // Current page number
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
}) => {
  const [filteredProductList, setFilteredProductList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    setFilteredProductList(productList);
  }, [productList]);

  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
    
    if (onSearch) {
      onSearch(query);
      return;
    }

    // Local filtering if no onSearch callback provided
    if (query.trim() !== "") {
      const results = productList
        .filter((product) => {
          const searchableValue = searchCriteria === "identifier" 
            ? product.identifier 
            : product.title;
          return searchableValue.toLowerCase().includes(query.toLowerCase());
        })
        .sort((a, b) => {
          const valueA = searchCriteria === "identifier" ? a.identifier : a.title;
          const valueB = searchCriteria === "identifier" ? b.identifier : b.title;
          
          // Prioritize names starting with the query
          const startsWithA = valueA
            .toLowerCase()
            .startsWith(query.toLowerCase());
          const startsWithB = valueB
            .toLowerCase()
            .startsWith(query.toLowerCase());
          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;
          return valueA.localeCompare(valueB);
        });

      setFilteredProductList(results);
    } else {
      setFilteredProductList(productList);
    }
  }, 300);

  const handleSelection = (product: Product) => {
    if (multiSelect) {
      const newSelectedIds = localSelectedIds.includes(product.identifier)
        ? localSelectedIds.filter(id => id !== product.identifier)
        : [...localSelectedIds, product.identifier];
      
      setLocalSelectedIds(newSelectedIds);
      
      const selectedProducts = productList.filter(p => 
        newSelectedIds.includes(p.identifier)
      );
      onSelect(selectedProducts);
    } else {
      onSelect(product);
      setSearchQuery(product.title);
    }
  };

  const clearSelection = () => {
    setLocalSelectedIds([]);
    setSearchQuery("");
    onSelect(multiSelect ? [] : {} as Product);
  };

  return (
    <VerticalRhythm>
      <Input
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`Search by ${searchCriteria}...`}
        label={`Search Products`}
      />
      
      {multiSelect && localSelectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
          <span className="text-sm text-blue-700">
            {localSelectedIds.length} product{localSelectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            onClick={clearSelection}
            size="small"
            variant="ghost"
          >
            Clear Selection
          </Button>
        </div>
      )}
      
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          marginTop: "16px",
        }}
      >
        {filteredProductList.length > 0 ? (
          filteredProductList.map((product) => (
            <div
              key={product.identifier}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "12px",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "8px",
                backgroundColor: localSelectedIds.includes(product.identifier)
                  ? "#F0F8FF"
                  : "#FFFFFF",
                border: localSelectedIds.includes(product.identifier)
                  ? "2px solid #007BFF"
                  : "1px solid #e0e0e0",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleSelection(product)}
            >
              {multiSelect && (
                <input
                  type="checkbox"
                  checked={localSelectedIds.includes(product.identifier)}
                  onChange={() => handleSelection(product)}
                  className="mr-3 mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {highlightQuery(product.title, searchQuery)}
                </div>
                
                <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                  Identifier: {highlightQuery(product.identifier, searchQuery)}
                </div>
                
                {product.family && (
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>
                    Family: {product.family}
                  </div>
                )}
                
                {product.categories.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>
                    Categories: {product.categories.slice(0, 3).join(", ")}
                    {product.categories.length > 3 && ` (+${product.categories.length - 3} more)`}
                  </div>
                )}
                
                <div style={{ fontSize: "12px", color: product.enabled ? "#059669" : "#DC2626" }}>
                  {product.enabled ? "✓ Enabled" : "✗ Disabled"}
                </div>
                
                {product.description && (
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666", 
                    marginTop: "4px",
                    maxHeight: "40px",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </div>
                )}
              </div>
              
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginLeft: "12px"
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            No products found
          </div>
        )}
      </div>
      
      {onPageChange && (
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            variant="ghost"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage}
          </span>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            variant="ghost"
          >
            Next
          </Button>
        </div>
      )}
    </VerticalRhythm>
  );
};

// Helper function to highlight the query in the text
const highlightQuery = (text: string, query: string): React.ReactNode => {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} style={{ color: "#007BFF", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default ProductSelector;