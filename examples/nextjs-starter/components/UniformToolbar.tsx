"use client";

import { useUniformContext } from "@uniformdev/context-react";
import { UniformToolbar } from "@uniformdev/toolbar-react";

/**
 * Floating Uniform toolbar (visitor profile, A/B forcing, optional simulator).
 * Must render under <UniformContext> in pages/_app.tsx.
 */
export function AppUniformToolbar() {
  const { context } = useUniformContext();

  return (
    <UniformToolbar
      // Local file: installs resolve @uniformdev/context from the toolbar monorepo
      // and the starter separately. Drop the cast after installing from npm with a
      // matching @uniformdev/context (^20.72).
      context={context as never}
      simulator
      enabled={process.env.NODE_ENV === "development"}
    />
  );
}
