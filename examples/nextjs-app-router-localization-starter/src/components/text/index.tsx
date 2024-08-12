import {
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { Parameters, Slots } from "./props";

export const TextComponent = ({
  component,
  context,
}: ComponentProps<Parameters, Slots>) => {
  return (
    <>
      <UniformText
        component={component}
        context={context}
        parameterId="text"
        as="h1"
        className="title"
        placeholder="Enter hero title"
      />
    </>
  );
};
