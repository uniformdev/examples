import { createPreviewHandler } from '@uniformdev/canvas-sveltekit/preview';
import { UNIFORM_PREVIEW_SECRET } from '$app/env/private';

const handlers = createPreviewHandler({
  secret: () => UNIFORM_PREVIEW_SECRET ?? '',
  playgroundPath: '/playground',
  resolveFullPath: ({ path, slug }) => {
    return path || slug || '/';
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
