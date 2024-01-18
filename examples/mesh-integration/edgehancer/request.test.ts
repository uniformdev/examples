import { expect, test } from 'vitest';

import { setupFetchInterceptor, setupTestRequestHookContext } from './_testUtils';
import request from './request';

test('fetches data resource definition', async () => {
  const expectedResponse = 'it worked';

  setupFetchInterceptor('https://httpbin.org', '/anything', expectedResponse);

  const context = setupTestRequestHookContext({
    batchPartials: [{ url: 'https://httpbin.org/anything' }],
  });

  const result = await request(context);

  expect(result).toStrictEqual<typeof result>({
    results: [
      {
        errors: [],
        warnings: [],
        surrogateKeys: [],
        result: expectedResponse,
      },
    ],
  });
});

test('modifies response to inject the fetch context if an object is returned from an API', async () => {
  const expectedResponse = { yes: 'it worked' };

  setupFetchInterceptor('https://httpbin.org', '/anything', expectedResponse);

  const context = setupTestRequestHookContext({
    batchPartials: [{ url: 'https://httpbin.org/anything' }],
  });

  const result = await request(context);

  expect(result).toStrictEqual<typeof result>({
    results: [
      {
        errors: [],
        warnings: [],
        surrogateKeys: [],
        result: {
          ...expectedResponse,
          // the custom edgehancer example injects this to object responses
          'custom-edgehancer-fetch-context': 'normal',
        },
      },
    ],
  });
});

test('uses any `id` query parameter values as surrogate keys', async () => {
  setupFetchInterceptor('https://httpbin.org', '/anything?id=1&id=2', 'irrelevant');

  const context = setupTestRequestHookContext({
    batchPartials: [
      {
        url: 'https://httpbin.org/anything',
        parameters: [
          { key: 'id', value: '1' },
          { key: 'id', value: '2' },
        ],
      },
    ],
  });

  const result = await request(context);

  expect(result).toMatchObject<typeof result>({
    results: [
      {
        // custom edgehancer example injects any 'id' query strings as surrogate cache keys
        surrogateKeys: ['1', '2'],
      },
    ],
  });
});
