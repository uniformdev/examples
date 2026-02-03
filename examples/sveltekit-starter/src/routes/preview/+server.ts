import { createPreviewHandler } from '@uniformdev/canvas-sveltekit/preview';

import { env } from '$env/dynamic/private';

/**
 * Preview handler for Uniform Canvas contextual editing.
 *
 * Configure in Uniform Canvas:
 * - Preview URL: https://your-site.com/api/preview
 *
 * For production, set UNIFORM_PREVIEW_SECRET environment variable.
 */
const handlers = createPreviewHandler({
  // Validate preview requests with a secret in production
  secret: () => env.UNIFORM_PREVIEW_SECRET ?? '',

  // Path to the playground page for component/pattern previews
  playgroundPath: '/playground',

  // Custom path resolution (defaults to path || slug)
  resolveFullPath: ({ path, slug }) => {
    return path || slug || '/';
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
