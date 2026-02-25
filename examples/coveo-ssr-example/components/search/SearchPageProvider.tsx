'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import type { SearchCompletedAction } from '@coveo/headless/ssr';
import {
  engineDefinition,
  type SearchStaticState,
  hydrateStaticState,
} from '../../lib/coveo/engine-definition';

type HydratedState = Awaited<ReturnType<typeof hydrateStaticState>>;

const { StaticStateProvider, HydratedStateProvider } = engineDefinition;

/**
 * Wraps the server-fetched static state and hydrates the Coveo engine on the client.
 * Until hydration finishes, it renders using the static controller state.
 */
export function SearchPageProvider({
  staticState,
  children,
  pipeline,
}: PropsWithChildren<{ staticState: SearchStaticState; pipeline?: string }>) {
  const [hydratedState, setHydratedState] = useState<HydratedState | null>(null);

  useEffect(() => {
    hydrateStaticState({
      searchAction: staticState.searchAction as SearchCompletedAction,
      pipeline: pipeline,
    }).then(setHydratedState);
  }, []); // (Coveo docs intentionally suppress deps here)

  if (!hydratedState) {
    return <StaticStateProvider controllers={staticState.controllers}>{children}</StaticStateProvider>;
  }

  return (
    <HydratedStateProvider engine={hydratedState.engine} controllers={hydratedState.controllers}>
      {children}
    </HydratedStateProvider>
  );
}
