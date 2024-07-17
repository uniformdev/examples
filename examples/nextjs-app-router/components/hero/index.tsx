import {
  ComponentProps,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { Parameters, Slots } from "./props";

export const HeroComponent = ({
  component,
  context,
}: ComponentProps<Parameters, Slots>) => {
  return (
    <>
      <UniformText
        component={component}
        context={context}
        parameterId="title"
        as="h1"
        className="title"
        placeholder="Enter hero title"
      />
      <UniformRichText
        component={component}
        parameterId="description"
        className="description"
        placeholder="Enter hero description"
      />
    </>
  );
};
