import { expect, test } from 'vitest';

import { setupFetchInterceptor, setupTestRequestHookContext } from './_testUtils';
import requestBatched from './requestBatched';

test('converts batch of data resources into single request', async () => {
  const apiBatchResponse = [
    { id: 'id-1', name: 'test 1' },
    { id: 'id-2', name: 'test 2' },
  ];

  // we expect to get a fetch to a batch endpoint with the IDs as a query parameter
  setupFetchInterceptor('https://mybatchapi.com', '/entities?ids=id-1,id-2', apiBatchResponse);

  const context = setupTestRequestHookContext({
    batchPartials: [
      // two separate data resources for disparate single IDs
      { url: 'https://mybatchapi.com/entities', parameters: [{ key: 'id', value: 'id-1' }] },
      { url: 'https://mybatchapi.com/entities', parameters: [{ key: 'id', value: 'id-2' }] },
    ],
  });

  const result = await requestBatched(context);

  expect(result).toStrictEqual<typeof result>({
    // the result is the API response wrapped in { result: ...} objects
    results: apiBatchResponse.map((apiBatchItem) => ({ result: apiBatchItem })),
  });
});
