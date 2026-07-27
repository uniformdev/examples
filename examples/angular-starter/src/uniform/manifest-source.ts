import { isPlatformServer } from '@angular/common';
import {
  PLATFORM_ID,
  REQUEST_CONTEXT,
  TransferState,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';
import type { ManifestV2 } from '@uniformdev/context';

import bundledManifest from './manifest.json';

/**
 * Resolves the Uniform Context manifest for the current platform.
 *
 * - **Server:** the manifest fetched for this request by `server.ts` arrives through
 *   Angular's `REQUEST_CONTEXT`, and is written to `TransferState` on the way out.
 * - **Browser:** read back from `TransferState`, so hydration scores against exactly the
 *   manifest the server rendered with (a mismatch would show up as personalization
 *   flipping between the server HTML and the hydrated app).
 * - Either platform falls back to the committed `manifest.json` when Uniform is not
 *   configured (local demo mode) or the request was not served by `server.ts`.
 */

/** Shape `server.ts` passes to `AngularNodeAppEngine.handle(request, requestContext)`. */
export interface UniformRequestContext {
  uniformManifest?: ManifestV2;
  uniformManifestRevision?: string;
}

interface TransferredManifest {
  manifest: ManifestV2;
  revision: string;
}

const MANIFEST_STATE_KEY = makeStateKey<TransferredManifest>('uniform.manifest');

const BUNDLED_REVISION = 'bundled';

const revision = signal(BUNDLED_REVISION);

/**
 * Content hash of the manifest the browser is currently running on. Compare it with
 * `/api/uniform-manifest` to detect that a newer manifest has been published.
 */
export const uniformManifestRevision = revision.asReadonly();

/**
 * Manifest factory for `provideUniformContext({ manifest: resolveUniformManifest })`.
 * Must be called in an injection context (it runs inside the `UNIFORM_CONTEXT` factory).
 */
export function resolveUniformManifest(): ManifestV2 {
  const transferState = inject(TransferState);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    const requestContext = inject(REQUEST_CONTEXT, {
      optional: true,
    }) as UniformRequestContext | null;

    const transferred: TransferredManifest = {
      manifest: requestContext?.uniformManifest ?? (bundledManifest as ManifestV2),
      revision: requestContext?.uniformManifestRevision ?? BUNDLED_REVISION,
    };

    // Handed to the browser alongside __UNIFORM_DATA__ (see provideUniformContextTransfer).
    transferState.set(MANIFEST_STATE_KEY, transferred);

    // Deliberately not stamped into `revision` here: module state is shared across SSR
    // requests, and the value is only ever read in the browser.
    return transferred.manifest;
  }

  const transferred = transferState.get(MANIFEST_STATE_KEY, null);

  revision.set(transferred?.revision ?? BUNDLED_REVISION);

  return transferred?.manifest ?? (bundledManifest as ManifestV2);
}
