import {
  type ComponentProps,
  registerUniformComponent,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-react";
import type { RichTextParamValue } from "@uniformdev/canvas";

export type HeroProps = ComponentProps<{
  title?: string;
  description?: RichTextParamValue;
}>;

export function HeroComponent(_props: HeroProps) {
  return (
    <>
      <UniformText
        parameterId="title"
        className="title"
        placeholder="title goes here"
        as="h1"
      />
      <UniformRichText
        parameterId="description"
        placeholder="description goes here"
      />
    </>
  );
}

registerUniformComponent({
  type: "hero",
  component: HeroComponent,
});
