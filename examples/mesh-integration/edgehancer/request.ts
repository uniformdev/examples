import {
  getDataResourceAsRequest,
  type RequestEdgehancerDataResourceResolutionResult,
  type RequestHookFn,
} from '@uniformdev/mesh-edgehancer-sdk';

/**
 * This is an example of a request hook.
 *
 * Request hooks are passed a batch of data resources to fetch.
 * The hook returns the fetched results. The result MUST be in the same order and have the same count as the input batch.
 *
 *  Common use cases for request hooks are:
 * - implementing request batching (i.e. if separate data resources fetch entities with ID 1, 2, and 3, the hook can fetch api.com/entities?ids=1,2,3 once)
 * - performing OAuth access token exchanges to fetch data from an OAuth-secured API
 * - implementing custom business rules around data, such as:
 *    - hiding irrelevant or private API response data from authors
 *    - enriching API data by combining multiple sources
 *    - remapping difficult to consume API data, such as APIs that return data in a non-JSON format
 *
 * Data resources being fetched by this hook may come from:
 * - A data type being tested in the Uniform UI
 * - Data resources being fetched in the composition or entry editor UI
 * - Data resources being fetched as part of the composition, entry, or route APIs
 * - Ephemeral data resources being fetched by an integration UI using the Mesh SDK's `getDataResource` function
 *
 * Request hooks are run when the data resource cache is stale, and needs to be fetched.
 * Validly cached data resources do not cause invocation of the request hook.
 *
 * The data resource's cache key is fixed before the request hook is run. It is important to fetch the same data
 * for a given data resource request input. If you need to make a dynamic request and cache it, use a pre-request hook
 * and change the request parameters there.
 *
 * Request hooks can signal their work in several ways:
 * - adding `errors` to a data resource. Errors will be displayed in the UI.
 *    NOTE: if the hook throws an unhandled exception, its message will be automatically added as an error to every data resource in the batch.
 * - adding `warnings` to a data resource. Warnings will be displayed in the UI.
 * - adding a `badge` to a data resource. The badge text will be displayed alongside the data resource when it is shown in the UI.
 * - returning `surrogateKeys`. Surrogate keys can be used as an alternate cache key for the data resource, which can be purged together.
 *    For example you might return an external entity ID as a surrogate key, and then send a purge request for that key when the entity is updated externally.
 */
const request: RequestHookFn = async ({ dataResources, fetchContext }) => {
  // NOTE: this example is demonstrating how to iteratively process a batch of data resources with the map() function.
  // It is also possible to implement batch requests to improve HTTP performance; see requestBatched.ts for an example of that.
  const results = dataResources.map<Promise<RequestEdgehancerDataResourceResolutionResult>>(
    async ({ dataResource }) => {
      // EXAMPLE: return hard-coded data without making a request, if the data resource's archetype is 'hardcoded'
      if (dataResource.archetype === 'hardcoded') {
        return {
          result: { hardcoded: 'result from request edgehancer' },
        };
      }

      const result: Required<RequestEdgehancerDataResourceResolutionResult> = {
        errors: [],
        warnings: [],
        result: {},
        surrogateKeys: [],
      };

      // EXAMPLE: add an error to the data resource if its archetype is error
      if (dataResource.archetype === 'error') {
        result.errors.push('error added by request edgehancer');
      }

      // EXAMPLE: add a warning to the data resource if its archetype is warning
      if (dataResource.archetype === 'warning') {
        result.warnings.push('warning added by request edgehancer');
      }

      // EXAMPLE: add any 'id' query parameters as surrogate keys
      dataResource.parameters?.forEach(({ key, value }) => {
        if (key === 'id') {
          result.surrogateKeys.push(value);
        }
      });

      // EXAMPLE: fetch the data resource using `fetch` API and return its result JSON
      // This is approximately equivalent to the default request without any custom hook.

      // Convert the data resource into a Request object
      // (note: more granular fns exist for partial conversion, i.e. getDataResourceQueryString, getDataResourceHeaders, getDataResourceUrl)
      const request = getDataResourceAsRequest(dataResource);

      // fetch the data resource
      const response = await fetch(request);

      // parse the response as text (nicer for error handling)
      const responseText = await response.text();

      // catch and return a HTTP error status code
      if (!response.ok) {
        result.errors.push(
          `request to ${request.url} failed with status ${response.status}, response: ${responseText}`
        );
        return result;
      }

      // return the response parsed as JSON
      try {
        result.result = JSON.parse(responseText);
      } catch (e) {
        result.errors.push(`request to ${request.url} returned invalid JSON: ${e}`);
      }

      // EXAMPLE: result transformation, if the fetch result is an object inject a `custom-edgehancer-fetch-context` property
      if (typeof result.result === 'object' && !Array.isArray(result.result)) {
        result.result['custom-edgehancer-fetch-context'] = fetchContext;
      }

      return result;
    }
  );
  return {
    results: await Promise.all(results),
  };
};

export default request;
