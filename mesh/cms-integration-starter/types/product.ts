import { flattenProductValues, getLocalizedValue, getImageUrl } from '../lib/akeneo-utils';

export interface AkeneoProduct {
  identifier: string;
  enabled: boolean;
  family: string | null;
  categories: string[];
  groups: string[];
  parent: string | null;
  values: {
    [attributeCode: string]: Array<{
      locale?: string | null;
      scope?: string | null;
      data: any;
    }>;
  };
  associations: {
    [associationType: string]: {
      products?: string[];
      product_models?: string[];
      groups?: string[];
    };
  };
  quantified_associations: {
    [associationType: string]: {
      products?: Array<{
        identifier: string;
        quantity: number;
      }>;
      product_models?: Array<{
        identifier: string;
        quantity: number;
      }>;
    };
  };
  created: string;
  updated: string;
  metadata?: {
    workflow_status?: string;
  };
}

export interface AkeneoProductsResponse {
  _links: {
    self: {
      href: string;
    };
    first: {
      href: string;
    };
    previous?: {
      href: string;
    };
    next?: {
      href: string;
    };
  };
  current_page: number;
  _embedded: {
    items: AkeneoProduct[];
  };
}

// Simplified product interface for UI display
export interface Product {
  identifier: string;
  title: string; // Changed from 'name' to 'title' to match UI usage
  description?: string;
  family?: string;
  enabled: boolean;
  categories: string[];
  imageUrl?: string;
}

// Helper functions are now imported from shared utilities

// Transform Akeneo product to simplified Product interface
export const transformAkeneoProduct = (akeneoProduct: AkeneoProduct, locale?: string | null, baseUrl?: string, thumbnailImageAttribute?: string): Product => {
  // First, flatten the product using the shared utility
  const flattenedProduct = flattenProductValues(akeneoProduct);

  // Get product name/title - now works with flattened attributes
  const getTitle = (): string => {
    const nameAttributes = ['name', 'label', 'title', 'product_name'];

    // Try flattened attributes first (direct property access)
    for (const attr of nameAttributes) {
      const value = flattenedProduct[attr];
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    // Fallback to localized lookup in original nested structure
    for (const attr of nameAttributes) {
      const value = getLocalizedValue(akeneoProduct.values[attr], locale);
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return akeneoProduct.identifier;
  };

  // Get product description - now works with flattened attributes
  const getDescription = (): string | undefined => {
    const descriptionAttributes = ['description', 'short_description', 'summary', 'product_description'];

    // Try flattened attributes first (direct property access)
    for (const attr of descriptionAttributes) {
      const value = flattenedProduct[attr];
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    // Fallback to localized lookup in original nested structure
    for (const attr of descriptionAttributes) {
      const value = getLocalizedValue(akeneoProduct.values[attr], locale);
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return undefined;
  };

  // Get main product image - now works with flattened attributes and proxy URLs
  const getMainImageUrl = (): string | undefined => {
    // If a specific thumbnail attribute is configured, try it first
    if (thumbnailImageAttribute) {
      // Try flattened attribute first (already has proxy URL transformation)
      const flattenedImageValue = flattenedProduct[thumbnailImageAttribute];
      if (flattenedImageValue && typeof flattenedImageValue === 'string') {
        return flattenedImageValue;
      }

      // Fallback to original nested structure
      const imageValue = getLocalizedValue(akeneoProduct.values[thumbnailImageAttribute], locale);
      if (imageValue) {
        const imageUrl = getImageUrl(imageValue, baseUrl);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }

    // Auto-discovery of image attributes
    const availableAttributes = Object.keys(akeneoProduct.values || {});
    const potentialImageAttributes = availableAttributes.filter(attr =>
      attr.toLowerCase().includes('image') ||
      attr.toLowerCase().includes('picture') ||
      attr.toLowerCase().includes('photo') ||
      attr.toLowerCase().includes('thumb')
    );

    // Try main image attributes in order of preference
    const imageAttributes = [
      'main_image', 'image', 'main_picture', 'picture', 'primary_image', 'thumbnail',
      ...potentialImageAttributes
    ];

    // Remove duplicates and exclude the already-tried thumbnail attribute
    const uniqueImageAttributes = [...new Set(imageAttributes)].filter(attr => attr !== thumbnailImageAttribute);

    for (const attr of uniqueImageAttributes) {
      // Try flattened attribute first (already has proxy URL transformation)
      const flattenedImageValue = flattenedProduct[attr];
      if (flattenedImageValue && typeof flattenedImageValue === 'string') {
        return flattenedImageValue;
      }

      // Fallback to original nested structure
      const imageValue = getLocalizedValue(akeneoProduct.values[attr], locale);
      if (imageValue) {
        const imageUrl = getImageUrl(imageValue, baseUrl);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }

    return undefined;
  };

  return {
    identifier: akeneoProduct.identifier,
    title: getTitle(),
    description: getDescription(),
    family: akeneoProduct.family || undefined,
    enabled: akeneoProduct.enabled,
    categories: akeneoProduct.categories || [],
    imageUrl: getMainImageUrl(),
  };
};