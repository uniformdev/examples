import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  EMPTY_COMPOSITION,
  IN_CONTEXT_EDITOR_QUERY_STRING_PARAM,
  ResolvedRouteGetResponse,
  RouteClient,
  RootComponentInstance,
} from '@uniformdev/canvas';

import { environment } from '../environments/environment';
import { sampleComposition } from '../uniform/sample-composition';

export type UniformRouteResult = ResolvedRouteGetResponse;

/**
 * Locale to localize Route API responses to. Without it, localized parameters are
 * returned as per-locale maps (`locales`) instead of flat `value`s and would render empty.
 */
const LOCALE = 'en-US';

function getCredentials(): { projectId: string; apiKey: string } | undefined {
  // On the SSR server, environment variables take precedence over environment.ts.
  const projectId =
    (typeof process !== 'undefined' && process.env?.['UNIFORM_PROJECT_ID']) ||
    environment.uniformProjectId;
  const apiKey =
    (typeof process !== 'undefined' && process.env?.['UNIFORM_API_KEY']) ||
    environment.uniformApiKey;

  return projectId && apiKey ? { projectId, apiKey } : undefined;
}

/**
 * True when the `preview` query param unlocks draft-state fetching.
 *
 * On the server the param must match `UNIFORM_PREVIEW_SECRET` (when configured; the
 * `/api/preview` endpoint issues such URLs). In the browser the param is trusted:
 * the initial draft load is always SSR-validated and handed over via TransferState,
 * and the API key must have draft-read permission for a client refetch to succeed.
 */
function isDraftAllowed(previewParam: string | null, isServer: boolean): boolean {
  if (!previewParam) {
    return false;
  }

  if (isServer) {
    const secret = typeof process !== 'undefined' && process.env?.['UNIFORM_PREVIEW_SECRET'];
    return secret ? previewParam === secret : previewParam === 'true';
  }

  return true;
}

/**
 * Resolves the Uniform route (composition/redirect/notFound) for the requested path.
 *
 * - With Uniform credentials configured, fetches from the Route API (draft state when
 *   `?preview=<preview secret>`, published otherwise).
 * - Without credentials, serves the bundled sample composition (local demo mode).
 * - SSR responses are passed to the browser via Angular TransferState so hydration
 *   does not refetch.
 */
export const uniformRouteResolver: ResolveFn<UniformRouteResult> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const path = '/' + route.url.map(({ path }) => path).join('/');
  const transferState = inject(TransferState);
  const isServer = isPlatformServer(inject(PLATFORM_ID));
  // Injected up front: the injection context is gone after the first `await`, so
  // resolving the Router lazily in the redirect branch below would throw NG0203.
  const router = inject(Router);
  const isPreview = isDraftAllowed(route.queryParamMap.get('preview'), isServer);
  const isContextualEditing =
    isPreview && route.queryParamMap.get(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM) === 'true';

  // Inside the Canvas editor there is no need to fetch the composition: the editor
  // pushes it (including unsaved edits) over the canvas channel. Rendering the
  // EMPTY_COMPOSITION stub avoids a mismatch between the fetched draft and the
  // composition open in the editor ("Preview is no longer showing the current
  // composition"). The /api/preview endpoint strips the editor query param when the
  // request does not actually come from the editor.
  if (isContextualEditing) {
    return {
      type: 'composition',
      matchedRoute: path,
      compositionApiResponse: { composition: EMPTY_COMPOSITION as RootComponentInstance },
    } as UniformRouteResult;
  }

  const stateKey = makeStateKey<UniformRouteResult>(`uniform-route:${state.url}`);

  // TransferState first: the browser bundle typically has no credentials (they live in
  // server-side env vars), so the SSR response must win over the sample fallback below.
  if (!isServer && transferState.hasKey(stateKey)) {
    const transferred = transferState.get(stateKey, null);
    transferState.remove(stateKey);

    if (transferred) {
      return transferred;
    }
  }

  const credentials = getCredentials();
  let response: UniformRouteResult | undefined;

  if (credentials) {
    const client = new RouteClient({
      projectId: credentials.projectId,
      apiKey: credentials.apiKey,
      disableSWR: true,
    });

    response = await client.getRoute({
      path,
      state: isPreview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
      locale: LOCALE,
    });
  } else if (!isServer) {
    // Client-side navigation: the browser bundle has no credentials, so route
    // resolution goes through the demo server (see /api/uniform-route in server.ts),
    // keeping the API key server-side. The raw preview param is validated there.
    response = await fetchRouteFromProxy(path, route.queryParamMap.get('preview'));
  }

  if (!response) {
    // Local demo mode: every path serves the sample composition.
    return {
      type: 'composition',
      matchedRoute: path,
      compositionApiResponse: { composition: sampleComposition },
    } as UniformRouteResult;
  }

  if (response.type === 'redirect') {
    return new RedirectCommand(router.parseUrl(response.redirect.targetUrl));
  }

  if (isServer) {
    transferState.set(stateKey, response);
  }

  return response;
};

/** Browser-only: resolve the route via the demo server. Returns undefined when the server has no credentials (local demo mode) or the request fails. */
async function fetchRouteFromProxy(
  path: string,
  previewParam: string | null
): Promise<UniformRouteResult | undefined> {
  try {
    const params = new URLSearchParams({ path, locale: LOCALE });

    if (previewParam) {
      params.set('preview', previewParam);
    }

    const response = await fetch(`/api/uniform-route?${params}`);

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as UniformRouteResult;
  } catch {
    return undefined;
  }
}
