import PreviewSwitch from "./PreviewSwitch";

function PreviewDevPanel({
  preview,
}: {
  preview?: boolean;
  compositionId: string;
}) {
  console.log(preview ? "🥽 Preview enabled ✅" : "🥽 Preview disabled ⛔");
  return <PreviewSwitch previewing={preview} />;
}

export default PreviewDevPanel;
