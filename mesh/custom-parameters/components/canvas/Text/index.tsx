import { FC } from "react";
import {
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import BaseText, { TextProps as BaseTextProps } from "@/components/ui/Text";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type TextParameters = {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: BaseTextProps["size"];
  weight?: BaseTextProps["weight"];
  alignment?: BaseTextProps["alignment"];
  transform?: BaseTextProps["transform"];
  decoration?: BaseTextProps["decoration"];
  letterSpacing?: BaseTextProps["letterSpacing"];
};

type TextProps = ComponentProps<TextParameters>;

const TextComponent: FC<TextProps> = ({
  tag,
  size,
  weight,
  transform,
  decoration,
  letterSpacing,
  alignment,
  component,
  context,
}) => (
  <BaseText
    {...{
      size,
      weight,
      transform,
      decoration,
      letterSpacing,
      alignment,
    }}
  >
    <UniformText
      placeholder="Text goes here"
      parameterId="text"
      as={tag || undefined}
      component={component}
      context={context}
    />
  </BaseText>
);

export const textMapping: ResolveComponentResultWithType = {
  type: "text",
  component: TextComponent,
};

export default TextComponent;
