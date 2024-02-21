import { expect, test } from 'vitest';

import { setupTestPreRequestDataResourceContext, setupTestPreRequestHookContext } from './_testUtils';
import preRequest from './preRequest';

test('passes through data resource definition', async () => {
  const context = setupTestPreRequestHookContext({
    dataResources: [setupTestPreRequestDataResourceContext()],
  });

  const result = await preRequest(context);

  expect(result).toStrictEqual<typeof result>({
    dataResources: [
      {
        dataResource: setupTestPreRequestDataResourceContext().dataResource,
        errors: [],
        warnings: [],
      },
    ],
  });
});

test('sets up custom editing attributes when editing fetchContext', async () => {
  const context = setupTestPreRequestHookContext({
    dataResources: [setupTestPreRequestDataResourceContext()],
    fetchContext: 'editing',
  });

  const result = await preRequest(context);

  expect(result).toMatchObject({
    dataResources: [
      {
        dataResource: {
          url: 'https://httpbin.org/anything/preview',
          headers: [{ key: 'x-preview', value: 'true' }],
          parameters: [{ key: 'preview', value: 'true' }],
        },
      },
    ],
  });
});

test('returns warning when archetype is changed to `warning`', async () => {
  const context = setupTestPreRequestHookContext({
    dataResources: [setupTestPreRequestDataResourceContext({ archetype: 'warning' })],
  });

  const result = await preRequest(context);

  expect(result).toMatchObject({
    dataResources: [
      {
        warnings: ['warning added by pre-request edgehancer'],
      },
    ],
  });
});
