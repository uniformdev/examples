/* eslint-disable no-console */
import type { LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import type { RootComponentInstance } from '@uniformdev/canvas';
import { RouteClient } from '@uniformdev/canvas';
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';
import { UniformComposition, UniformSlot } from '@uniformdev/canvas-react';

import { resolveRenderer } from '../components';

type CatchallData = {
  composition: RootComponentInstance;
};

export default function CatchallRoute() {
  const { composition } = useLoaderData<CatchallData>();
  return (
    <>
      <div>
        <UniformComposition data={composition as RootComponentInstance} resolveRenderer={resolveRenderer}>
          <UniformSlot name="content" />
        </UniformComposition>
      </div>
    </>
  );
}

export const loader: LoaderFunction = async ({ params, context }): Promise<CatchallData> => {
  const slug = params['canvasRoute'];
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;

  const client = new RouteClient({
    apiKey: context!.UNIFORM_API_KEY as string,
    projectId: context!.UNIFORM_PROJECT_ID as string,
  });

  const response = await client.getRoute({
    path: slugString ? `/${slugString}` : '/',
    state: process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
    diagnostics: true,
  });

  if (response.type === 'notFound') {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  if (response.type === 'redirect') {
    throw new Response(null, {
      status: response.redirect.targetStatusCode,
      headers: {
        Location: response.redirect.targetUrl,
      },
    });
  }

  return {
    composition: response.compositionApiResponse.composition,
  };
};
