import { FC } from "react";
import {
  ComponentProps,
  UniformRichText,
} from "@uniformdev/canvas-next-rsc/component";
import { RichTextNode } from "@uniformdev/richtext";
import BaseText from "@/components/ui/Text";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type RichTextParameters = {
  text?: RichTextNode;
};

type RichTextProps = ComponentProps<RichTextParameters>;

const RichText: FC<RichTextProps> = ({ component }) => (
  <BaseText>
    <UniformRichText
      className="prose max-w-full marker:text-current [&_*:not(pre)]:text-current"
      parameterId="text"
      component={component}
      placeholder="Rich text content goes here..."
    />
  </BaseText>
);

export const richTextMapping: ResolveComponentResultWithType = {
  type: "richText",
  component: RichText,
};

export default RichText;
