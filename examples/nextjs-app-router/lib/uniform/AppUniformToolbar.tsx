"use client";

import { useUniformContext } from "@uniformdev/next-app-router-client";
import { UniformToolbar } from "@uniformdev/toolbar-react";

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
