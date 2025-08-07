import {
  getDataResourceAsRequest,
  type RequestEdgehancerDataResourceResolutionResult,
  type RequestHookFn,
} from '@uniformdev/mesh-edgehancer-sdk';
import { flattenProductValues } from '../lib/akeneo-utils';

/**
 * Akeneo PIM Request Edgehancer
 * 
 * This edgehancer handles Akeneo PIM API requests and provides response transformation:
 * - For single product requests (search + limit=1): flattens response to return the product directly
 * - For multi-product requests: returns the full Akeneo response structure with flattened products
 * - Flattens product "values" object by hoisting attributes to top level with simplified key/value format
 * - Extracts "data" from first array element for each attribute value
 * - Transforms image URLs to use proxy service: https://akeneo-image-proxy.vercel.app/api/image
 * - Handles errors gracefully and provides meaningful error messages
 */
const request: RequestHookFn = async ({ dataResources }) => {
  const results = dataResources.map<Promise<RequestEdgehancerDataResourceResolutionResult>>(
    async ({ dataResource }) => {
      const result: Required<RequestEdgehancerDataResourceResolutionResult> = {
        errors: [],
        warnings: [],
        infos: [],
        result: {},
        surrogateKeys: [],
      };

      try {
        // Convert the data resource into a Request object
        const request = getDataResourceAsRequest(dataResource);
        
        // Check if this is a single product request by examining parameters
        const isSingleProductRequest = dataResource.parameters?.some(
          param => param.key === 'search' && param.value
        ) && dataResource.parameters?.some(
          param => param.key === 'limit' && param.value === '1'
        );

        // Fetch the data resource
        const response = await fetch(request);
        const responseText = await response.text();

        // Handle HTTP errors
        if (!response.ok) {
          result.errors.push(
            `Akeneo PIM API request failed with status ${response.status}: ${response.statusText}. Response: ${responseText}`
          );
          return result;
        }

        // Parse JSON response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          result.errors.push(`Invalid JSON response from Akeneo PIM API: ${e}`);
          return result;
        }

        // Use shared utility for flattening product values

        // Transform response based on request type
        if (isSingleProductRequest) {
          // For single product requests, flatten the response
          if (data._embedded?.items?.length > 0) {
            const product = data._embedded.items[0];
            result.result = flattenProductValues(product);
            
            // Count flattened attributes for logging
            const attributeCount = product.values ? Object.keys(product.values).length : 0;
            result.infos.push('Single product response flattened');
            if (attributeCount > 0) {
              result.infos.push(`Flattened ${attributeCount} product attributes from values`);
            }
          } else {
            result.result = null;
            result.warnings.push('No product found matching the search criteria');
          }
        } else {
          // For multi-product requests, return the full response but optionally flatten each product
          if (data._embedded?.items?.length > 0) {
            // Flatten each product in the response
            const flattenedItems = data._embedded.items.map((product: any) => flattenProductValues(product));
            result.result = {
              ...data,
              _embedded: {
                ...data._embedded,
                items: flattenedItems
              }
            };
            
            // Count total flattened attributes for logging
            const totalAttributes = data._embedded.items.reduce((count: number, product: any) => {
              return count + (product.values ? Object.keys(product.values).length : 0);
            }, 0);
            result.infos.push(`Retrieved and flattened ${data._embedded.items.length} products`);
            if (totalAttributes > 0) {
              result.infos.push(`Flattened ${totalAttributes} total product attributes from values`);
            }
          } else {
            result.result = data;
          }
        }

        // Add product identifiers as surrogate keys for cache management
        if (data._embedded?.items) {
          data._embedded.items.forEach((item: any) => {
            if (item.identifier) {
              result.surrogateKeys.push(`akeneo-product:${item.identifier}`);
            }
          });
        } else if (data.identifier) {
          // Single product case after flattening
          result.surrogateKeys.push(`akeneo-product:${data.identifier}`);
        }

      } catch (error) {
        result.errors.push(`Unexpected error in Akeneo PIM edgehancer: ${error instanceof Error ? error.message : String(error)}`);
      }

      return result;
    }
  );

  return {
    results: await Promise.all(results),
  };
};

export default request;