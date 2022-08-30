import useLivePreviewNextStaticProps from "./useLivePreviewNextStaticProps";
import getConfig from "next/config";
import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";

import PreviewSwitch from "./PreviewSwitch";

function PreviewDevPanel({
  preview,
  compositionId,
}: {
  preview?: boolean;
  compositionId: string;
}) {
  const {
    publicRuntimeConfig: { projectId },
  } = getConfig();
  const { serverRuntimeConfig } = getConfig();
  const { apiKey, apiHost } = serverRuntimeConfig;

  useLivePreviewNextStaticProps({
    compositionId,
    projectId: projectId,
  });

  console.log(preview ? "🥽 Preview enabled ✅" : "🥽 Preview disabled ⛔");

  return (
    <>
      <ToggleEmbeddedContextDevTools
        initialSettings={{
          apiHost: apiHost,
          apiKey: apiKey,
          projectId: projectId,
        }}
      />
      <PreviewSwitch previewing={preview} />
    </>
  );
}

export default PreviewDevPanel;
