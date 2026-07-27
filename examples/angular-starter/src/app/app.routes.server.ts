import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Personalized pages must be rendered per request — prerendering would bake
    // a single variant into static HTML.
    renderMode: RenderMode.Server,
  },
];
