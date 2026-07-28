import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideUniformContextTransfer } from '@uniformdev/context-angular/server';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Emits the __UNIFORM_DATA__ transfer state script so the browser Context
    // hydrates with server-computed scores and assigned test variants.
    provideUniformContextTransfer(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
