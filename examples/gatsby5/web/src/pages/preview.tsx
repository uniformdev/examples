import * as React from "react";
import type {
  GetServerDataProps,
  GetServerDataReturn,
  PageProps,
} from "gatsby";
import { UniformCompositionProps } from "@uniformdev/canvas-react";
import { enhanceComposition, getComposition } from "../lib/canvas";
import PageComposition from "../compositions/page";

export async function getServerData({
  query,
}: GetServerDataProps): GetServerDataReturn {
  const { slug } = query || {};
  const composition = await getComposition((slug as string) || "/", true);
  await enhanceComposition(composition);
  return {
    status: 200,
    props: { composition },
  };
}

const PreviewPage = (props: PageProps) => {
  const { serverData } = props;
  const { composition } = (serverData as any) || {};
  const contextualEditingEnhancer: UniformCompositionProps["contextualEditingEnhancer"] =
    async ({ composition }) => {
      await enhanceComposition(composition);
      return composition;
    };

  return (
    <PageComposition
      pageContext={{ composition }}
      contextualEditingEnhancer={contextualEditingEnhancer}
    />
  );
};

export default PreviewPage;
