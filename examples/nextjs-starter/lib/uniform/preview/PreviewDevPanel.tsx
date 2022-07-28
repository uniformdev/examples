import useLivePreviewNextStaticProps from "./useLivePreviewNextStaticProps";
import getConfig from "next/config";
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

  useLivePreviewNextStaticProps({
    compositionId,
    projectId: projectId,
  });
  console.log(preview ? "🥽 Preview enabled ✅" : "🥽 Preview disabled ⛔");
  return <PreviewSwitch previewing={preview} />;
}

export default PreviewDevPanel;
