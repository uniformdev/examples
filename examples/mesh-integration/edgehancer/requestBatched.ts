import {
  convertBatchResultsToEdgehancerResult,
  getDataResourceAsRequest,
  RequestEdgehancerDataResourceContext,
  RequestHookFn,
  resolveBatchFetchIds,
} from '@uniformdev/mesh-edgehancer-sdk';

/**
 * This is an example of a request hook that implements request batching.
 * For a more basic example, see request.ts.
 *
 * Request hooks are passed a batch of data resources to process, and each of those data resources
 * is guaranteed to be the same data archetype (expected API endpoint + response format).
 *
 * If the target API for an archetype supports fetching multiple entities by ID, request hooks can make a single request for the entire batch of data resources.
 * This can significantly improve latency by reducing the amount of network traffic required to service many data resources used on the same composition/entry.
 */
const requestBatched: RequestHookFn = async ({ dataResources }) => {
  // for this example we suppose the following:
  // - data resources for a single entity have the entity ID in the `id` query parameter (ex: https://api.com/entity?id=123)
  // - the target API supports fetching multiple entities by ID by passing the `ids` query parameter instead of `id` (ex: https://api.com/entity?ids=123,456,789)
  // - all fetches to the target API share the same headers and query string (except the id -> ids change) within the archetype (i.e. auth token)
  // - the target API need not respect the order of the IDs passed to it

  const getIdFromBatchItem = ({ dataResource }: RequestEdgehancerDataResourceContext) =>
    dataResource.parameters?.find((p) => p.key === 'id')?.value;

  // extract the IDs to fetch from the batch
  const batchFetchIds = resolveBatchFetchIds(dataResources, getIdFromBatchItem);

  // to determine the batch API call to fetch, we start with the request definition of the first data resource in the batch
  // and then modify a copy of it to point to the batch API endpoint
  const firstDataResource = dataResources[0].dataResource;
  const dataResourceToFetch = {
    ...firstDataResource,
    parameters: [
      // preserve data resource query params other than the `id` param
      ...(firstDataResource.parameters?.filter(({ key }) => key !== 'id') ?? []),
      // add `ids` parameter to the batched request
      { key: 'ids', value: batchFetchIds.validIds.join(',') },
    ],
  };

  // fetch the batch and parse results
  const batchResult = await fetch(getDataResourceAsRequest(dataResourceToFetch));

  // since we can only read the response once, parsing as text means we can show the response-text in the error message if it fails
  const responseText = await batchResult.text();

  // throwing an unhandled exception will add an error to every data resource in the batch automatically
  if (!batchResult.ok) {
    throw new Error(
      `request to ${batchResult.url} failed with status ${batchResult.status}, response: ${responseText}}`
    );
  }

  // assumption: API result is an array of objects with an `id` property, it can be any type as long as
  // * There is an array of results somewhere inside (to pass as batchResults below)
  // * Each item in the result array can have a function written to extract an ID from it (to pass as resolveIdFromBatchResultFn below)
  const batchResultJson = JSON.parse(responseText) as Array<{ id: string }>;

  // map the batch results into the result for each data resource in the batch
  return {
    results: convertBatchResultsToEdgehancerResult({
      batch: dataResources,
      batchFetchIds,
      batchResults: batchResultJson,
      resolveIdFromBatchResultFn: (batchResult) => batchResult.id.toString(),
      missingBatchResultErrorMessage: (batchItem) => `ID ${getIdFromBatchItem(batchItem)} was not found`,
    }),
  };
};

export default requestBatched;
