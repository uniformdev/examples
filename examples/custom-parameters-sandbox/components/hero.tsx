import {
  ComponentProps,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";

export const HeroComponent = ({
  component,
  context,
}: ComponentProps<HeroProps>) => {
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

export type HeroProps = {
  title: string;
  description: string;
};

export const heroMapping: ResolveComponentResultWithType = {
  type: "hero",
  component: HeroComponent,
};
