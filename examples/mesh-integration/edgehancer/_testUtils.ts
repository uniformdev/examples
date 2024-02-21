import {
  DataResourceFetchContext,
  EdgehancerMergedDataType,
  MergedDataType,
  PreRequestEdgehancerContext,
  PreRequestEdgehancerDataResourceContext,
  RequestEdgehancerContext,
} from '@uniformdev/mesh-edgehancer-sdk';

/** Mocks out a pre-request hook input context */
export function setupTestPreRequestHookContext(
  context: Partial<PreRequestEdgehancerContext>
): PreRequestEdgehancerContext {
  return {
    dataResources: [],
    fetchContext: 'normal',
    ...context,
  };
}

/** Mocks out a pre-request hook batch item */
export function setupTestPreRequestDataResourceContext(
  partial?: Partial<EdgehancerMergedDataType>
): PreRequestEdgehancerDataResourceContext {
  return {
    dataResource: setupTestDataResourceDefinition(partial),
  };
}

/** Mocks out a request hook input context */
export function setupTestRequestHookContext({
  batchPartials,
  fetchContext,
}: {
  batchPartials: Array<Partial<MergedDataType>>;
  fetchContext?: DataResourceFetchContext;
}): RequestEdgehancerContext {
  return {
    dataResources: batchPartials.map((partial) => ({
      dataResource: { ...setupTestDataResourceDefinition(), ...partial },
    })),
    fetchContext: fetchContext ?? 'normal',
  };
}

/** Mocks out a test data resource definition */
export function setupTestDataResourceDefinition(partial?: Partial<MergedDataType>): MergedDataType {
  return {
    connectorType: 'test',
    method: 'GET',
    archetype: 'default',
    url: 'https://httpbin.org/anything',
    displayName: 'Test Data Resource',
    id: 'test-data-resource',
    ...partial,
  };
}

/** Sets up a fetch interceptor on a specific origin and path to return a provided JSON response */
export function setupFetchInterceptor(origin: string, path: string, responseJson: unknown) {
  // custom edgehancers run on Cloudflare so we can use miniflare's vitest mocking toolkit
  // see https://miniflare.dev/testing
  const fetchMock = getMiniflareFetchMock();

  // prevent actual network requests
  fetchMock.disableNetConnect();

  // mock the response from the provided URL
  fetchMock.get(origin).intercept({ path }).reply(200, JSON.stringify(responseJson));
}
