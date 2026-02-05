import { createPreviewHandler } from '@uniformdev/canvas-sveltekit/preview';
import { env } from '$env/dynamic/private';

const handlers = createPreviewHandler({
  secret: () => env.UNIFORM_PREVIEW_SECRET ?? '',
  playgroundPath: '/playground',
  resolveFullPath: ({ path, slug }) => {
    return path || slug || '/';
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
