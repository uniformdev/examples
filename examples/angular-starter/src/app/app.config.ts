import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  UniformNotImplementedComponent,
  provideUniformComponents,
  provideUniformPreview,
} from '@uniformdev/canvas-angular';
import { enableContextDevTools } from '@uniformdev/context';
import { provideUniformContext } from '@uniformdev/context-angular';
import { provideUniformToolbar } from '@uniformdev/toolbar-angular';

import { resolveUniformManifest } from '../uniform/manifest-source';
import { routes } from './app.routes';
import { HeroComponent } from './components/hero/hero.component';
import { PageShellComponent } from './page/page-shell.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideUniformContext({
      // Resolved per SSR request from the manifest `server.ts` fetched live from
      // Uniform, and handed to the browser via TransferState. A manifest bundled at
      // build time goes stale the moment a signal/enrichment is published, and Context
      // silently ignores scores for dimensions it does not know about.
      manifest: resolveUniformManifest,
      // Feeds the Uniform Context DevTools Chrome extension. Plain Context plugins —
      // nothing Angular-specific. SSR-safe: the plugin guards all window/top access.
      plugins: [enableContextDevTools()],
      // Demo only: consent granted by default so visitor data persists across requests.
      defaultConsent: true,
    }),
    // Optional: quirk groupings / labels for the product toolbar (<uniform-toolbar />).
    provideUniformToolbar({
      quirkGroups: [{ title: 'Geo', ids: ['vc-city', 'vc-country'] }],
    }),
    provideUniformComponents(
      [
        { type: 'hero', component: HeroComponent },
        // Used by the playground to render composition-pattern roots.
        { type: 'page', component: PageShellComponent },
      ],
      // Unmapped component types render a "how to register this" panel instead of nothing.
      { fallback: UniformNotImplementedComponent }
    ),
    provideUniformPreview(),
  ],
};
