/**
 * Shared Akeneo PIM utility functions for data transformation
 * Used by both the edgehancer and client-side product transformation
 */

/**
 * Helper function to check if a string looks like an image URL
 */
export const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('image') || 
         lowerUrl.includes('media');
};

/**
 * Helper function to transform image URLs to use the proxy service
 */
export const transformImageUrl = (url: string): string => {
  if (isImageUrl(url)) {
    return `https://akeneo-image-proxy.vercel.app/api/image?url=${encodeURIComponent(url)}`;
  }
  return url;
};

/**
 * Helper function to flatten product values from Akeneo's nested structure
 * Hoists all attributes from the "values" object to the top level in simple key/value format
 * Extracts "data" from the first array element for each attribute value
 * Transforms image URLs to use proxy service
 */
export const flattenProductValues = (product: any): any => {
  const flattened = { ...product };
  
  if (product.values && typeof product.values === 'object') {
    const flattenedValues: Record<string, any> = {};
    
    // Process each attribute in values
    Object.keys(product.values).forEach(key => {
      const valueArray = product.values[key];
      if (Array.isArray(valueArray) && valueArray.length > 0) {
        // Get the data from the first element
        const firstValue = valueArray[0];
        if (firstValue && typeof firstValue === 'object' && 'data' in firstValue) {
          let data = firstValue.data;
          
          // Transform image URLs if the data looks like an image URL
          if (typeof data === 'string' && data.trim()) {
            data = transformImageUrl(data);
          }
          
          flattenedValues[key] = data;
        } else {
          // Fallback: use the entire first value if no data property
          flattenedValues[key] = firstValue;
        }
      }
    });
    
    // Add flattened values to the top level
    Object.assign(flattened, flattenedValues);
  }
  
  return flattened;
};

/**
 * Helper function to get localized value from Akeneo product attributes
 * Now works with both original nested structure and flattened structure
 */
export const getLocalizedValue = (values: any[] | any, locale?: string | null): any => {
  // Handle flattened structure (direct value)
  if (!Array.isArray(values)) {
    return values;
  }
  
  // Handle original nested structure (array of objects)
  if (!values || values.length === 0) return null;
  
  if (locale) {
    const localizedValue = values.find(v => v.locale === locale && v.data !== null && v.data !== undefined);
    if (localizedValue) return localizedValue.data;
  }
  
  const firstValidValue = values.find(v => v.data !== null && v.data !== undefined);
  return firstValidValue ? firstValidValue.data : null;
};

/**
 * Helper function to get image URL from Akeneo asset
 * Works with both original and flattened structures
 */
export const getImageUrl = (imageData: any, baseUrl?: string): string | undefined => {
  if (!imageData) return undefined;
  
  // Handle flattened structure (direct URL string)
  if (typeof imageData === 'string') {
    if (imageData.startsWith('http')) return imageData;
    if (baseUrl) return `${baseUrl}/api/rest/v1/media-files/${imageData}/download`;
    return undefined;
  }
  
  // Handle original nested structure (object with links)
  if (imageData._links && imageData._links.download && imageData._links.download.href) {
    return imageData._links.download.href;
  }
  if (imageData.url) return imageData.url;
  if (imageData.href) return imageData.href;
  
  return undefined;
};