"use client";

import {
  ClientContextComponent,
  createClientUniformContext,
  useInitUniformContext,
} from "@uniformdev/canvas-next-rsc/component";
import {
  ContextPlugin,
  enableContextDevTools,
  enableUniformInsights,
} from "@uniformdev/context";
// TODO: npm install @uniformdev/context-gtag if you need to enable GA4 plugin
// import { enableGoogleGtagAnalytics } from "@uniformdev/context-gtag";
import { useRouter } from "next/navigation";

export const UniformClientContext: ClientContextComponent = ({ manifest }) => {
  const router = useRouter();
  useInitUniformContext(() => {
    const plugins: ContextPlugin[] = [];

    plugins.push(
      enableContextDevTools({
        onAfterMessageReceived: () => {
          router.refresh();
        },
      })
    );

    if (process.env.NEXT_PUBLIC_UNIFORM_INSIGHTS_ENABLED === "true") {
      console.log("Uniform Insights enabled");
      plugins.push(
        // running against a local endpoint, will use edge middleware to rewrite to the actual endpoint
        enableUniformInsights({
          projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID!,
          endpoint: {
            type: "proxy",
            path: "/api/analytics",
          },
        })
      );
    }

    // TODO: Uncomment this to enable Google Analytics 4 plugin (after installing npm install @uniformdev/context-gtag)
    // plugins.push(enableGoogleGtagAnalytics());

    return createClientUniformContext({
      manifest,
      plugins,
      defaultConsent: true,
    });
  });

  return null;
};
