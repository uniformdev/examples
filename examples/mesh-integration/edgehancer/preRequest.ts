import {
  type PreRequestEdgehancerDataResourceResult,
  type PreRequestHookFn,
} from '@uniformdev/mesh-edgehancer-sdk';

/**
 * This is an example of a preRequest hook.
 *
 * Pre-request hooks are passed a batch of data resources to process.
 * The hook returns a modified batch of data resources. The result MUST be in the same order and have the same count as the input batch.
 *
 * Common use cases for pre-request hooks are:
 * - dynamically computing URL parameters based on conditional input data (perhaps stored in the `custom` property by the integration's UI)
 * - displaying different content from a data store based on editing state (i.e. showing draft content when editing)
 *
 * Data resources being fetched by this hook may come from:
 * - A data type being tested in the Uniform UI
 * - Data resources being fetched in the composition or entry editor UI
 * - Data resources being fetched as part of the composition, entry, or route APIs
 * - Ephemeral data resources being fetched by an integration UI using the Mesh SDK's `getDataResource` function
 *
 * Pre-request hooks are always run for every request regardless of the freshness of the data resource cache.
 * This enables pre-request hooks to compute dynamic cache keys by altering the request definition. The cache key
 * is computed using request parameters, i.e. the method, URL, headers, parameters, body.
 * NOTE: `custom` and `variables` properties are NOT cache key inputs.
 *
 * Pre-request hooks may not make HTTP requests.
 *
 * Variable references in the request definition of the data resource will be applied
 * to the data resource before you receive it in the preRequest hook. For example a
 * URL such as foo.com/${path} on a data type, followed by variables: { path: 'bar' } on the data resource,
 * will result in the hook receiving a data resource with a URL of foo.com/bar.
 *
 * Pre-request hooks can signal their work in three ways:
 * - adding `errors` to a data resource. Errors will be displayed in the UI and the data resource's HTTP request (or request hook) will not be made.
 *    NOTE: if the hook throws an unhandled exception, its message will be automatically added as an error to every data resource in the batch.
 * - adding `warnings` to a data resource. Warnings will be displayed in the UI; the data resource will still be requested.
 * - adding a `badge` to a data resource. The badge text will be displayed alongside the data resource when it is shown in the UI.
 */
const preRequest: PreRequestHookFn = async ({ dataResources, fetchContext }) => {
  return {
    dataResources: dataResources.map(({ dataResource }) => {
      // EXAMPLE: ignore a data resource if its archetype is ignore
      if (dataResource.archetype === 'ignore') {
        return { dataResource };
      }

      const result: Required<PreRequestEdgehancerDataResourceResult> = {
        dataResource,
        errors: [],
        warnings: [],
      };

      // EXAMPLE: swap API base URL if we are fetching for the editor UI, and the base URL is the httpbin reflection endpoint
      if (fetchContext === 'editing') {
        result.dataResource.url = result.dataResource.url.replace(
          'https://httpbin.org/anything',
          'https://httpbin.org/anything/preview'
        );

        // EXAMPLE: add a special header or parameter to the request for editing
        result.dataResource.headers ??= [];
        result.dataResource.headers.push({ key: 'x-preview', value: 'true' });

        result.dataResource.parameters ??= [];
        result.dataResource.parameters.push({ key: 'preview', value: 'true' });
      }

      // EXAMPLE: override the cache TTL if the data resource's archetype is dynamicTtl
      if (dataResource.archetype === 'dynamicTtl') {
        result.dataResource.ttl = 3600;
      }

      // EXAMPLE: add an error to the data resource if its archetype is error
      if (dataResource.archetype === 'error') {
        result.errors.push('error added by pre-request edgehancer');
      }

      // EXAMPLE: add a warning to the data resource if its archetype is warning
      if (dataResource.archetype === 'warning') {
        result.warnings.push('warning added by pre-request edgehancer');
      }

      // EXAMPLE: add a UI badge to the data resource if its archetype is badge (note: badges must be <= 12 characters)
      if (dataResource.archetype === 'badge') {
        result.dataResource.uiBadgeText = 'pre-enhanced';
      }

      return result;
    }),
  };
};

export default preRequest;
