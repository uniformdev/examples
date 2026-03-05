import { registerUniformComponent, UniformSlot } from "@uniformdev/canvas-react";

export type PageProps = unknown;
export type PageSlots = "content";

export function Page() {
  return (
    <>
      <UniformSlot name="content" />
    </>
  );
}

registerUniformComponent({
  type: "page",
  component: Page,
});
