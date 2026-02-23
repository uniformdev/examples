"use client";

import { ContextPlugin, enableContextDevTools } from "@uniformdev/context";
import { useRouter } from "next/navigation";
// TODO: Uncomment this to enable Uniform Insights plugin
// import { enableUniformInsights } from "@uniformdev/insights";
import {
  createClientUniformContext,
  useInitUniformContext,
  ClientContextComponent,
} from "@uniformdev/next-app-router-client";

export const CustomUniformClientContext: ClientContextComponent = ({
  manifest,
  disableDevTools,
  defaultConsent,
  experimentalQuirkSerialization,
  compositionMetadata,
}) => {
  const router = useRouter();

  useInitUniformContext(() => {
    const plugins: ContextPlugin[] = [
      // TODO: Uncomment this to enable Uniform Insights plugin
      // enableUniformInsights({
      //   endpoint: {
      //     type: "api",
      //     projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID!,
      //     apiKey: process.env.NEXT_PUBLIC_UNIFORM_INSIGHTS_API_KEY!,
      //     host: process.env.NEXT_PUBLIC_UNIFORM_INSIGHTS_API_URL!,
      //   },
      // }),
    ];

    if (!disableDevTools) {
      plugins.push(
        enableContextDevTools({
          onAfterMessageReceived: () => {
            router.refresh();
          },
        })
      );
    }

    return createClientUniformContext({
      manifest,
      plugins,
      defaultConsent,
      experimental_quirksEnabled: experimentalQuirkSerialization,
    });
  }, compositionMetadata);

  return null;
};
