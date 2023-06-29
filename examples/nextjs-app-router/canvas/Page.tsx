import {
  ComponentProps,
  UniformSlot,
  registerUniformComponent,
} from "@uniformdev/canvas-next-rsc";

export async function Page({ component }: ComponentProps) {
  return <UniformSlot name="content" data={component} />;
}

registerUniformComponent({
  type: "page",
  component: Page as any,
});
