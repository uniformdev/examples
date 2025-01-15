"use client";

import {
  Context,
  CookieTransitionDataStore,
  enableConsoleLogDrain,
  enableContextDevTools,
  ManifestV2,
} from "@uniformdev/context";
import { UniformContext as PackageUniformContext } from "@uniformdev/context-react";
import { useRef } from "react";

export const ClientUniformContext = ({
  children,
  manifest,
  serverCookieValue,
}: {
  children: React.ReactNode;
  manifest: ManifestV2;
  serverCookieValue: string | undefined;
}) => {
  const context = useRef<Context>(
    new Context({
      defaultConsent: true,
      manifest,
      plugins: [enableConsoleLogDrain("info"), enableContextDevTools()],
      transitionStore: new CookieTransitionDataStore({
        serverCookieValue,
      }),
    })
  );

  return (
    <PackageUniformContext context={context.current}>
      {children}
    </PackageUniformContext>
  );
};
