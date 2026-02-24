'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { engineDefinition, hydrateStaticState } from '../../lib/coveo/engine-definition';
const { StaticStateProvider, HydratedStateProvider } = engineDefinition;

/**
 * Wraps the server-fetched static state and hydrates the Coveo engine on the client.
 * Until hydration finishes, it renders using the static controller state.
 */
export function SearchPageProvider({
  staticState,
  children,
  pipeline,
}: PropsWithChildren<{ staticState: any; pipeline?: string }>) {
  const [hydratedState, setHydratedState] = useState<any>(null);

  useEffect(() => {
    hydrateStaticState({ searchAction: staticState.searchAction, pipeline: pipeline }).then(setHydratedState);
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
