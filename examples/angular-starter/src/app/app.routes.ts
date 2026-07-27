import { Routes } from '@angular/router';

import { PageComponent } from './page/page.component';
import { PlaygroundComponent } from './playground/playground.component';
import { uniformRouteResolver } from './uniform-route.resolver';

export const routes: Routes = [
  {
    // Pattern live preview for the Canvas editor (see /api/preview in server.ts).
    path: 'playground',
    component: PlaygroundComponent,
  },
  {
    path: '**',
    component: PageComponent,
    resolve: { route: uniformRouteResolver },
  },
];
