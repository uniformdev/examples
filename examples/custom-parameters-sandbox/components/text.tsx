import {
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";

export const TextComponent = ({
  component,
  context,
}: ComponentProps<TextProps>) => {
  return (
    <UniformText
      component={component}
      context={context}
      parameterId="text"
      as="h1"
      className="text-5xl font-bold"
      placeholder="Enter text"
    />
  );
};

export type TextProps = {
  text?: string;
};

export const textMapping: ResolveComponentResultWithType = {
  type: "text",
  component: TextComponent,
};
