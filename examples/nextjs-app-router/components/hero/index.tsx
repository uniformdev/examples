"use client";

import {
  ComponentProps,
  UniformText,
  useUniformContext,
} from "@uniformdev/canvas-next-rsc/component";
import { Parameters, Slots } from "./props";

export const HeroComponent = ({
  component,
  context,
}: ComponentProps<Parameters, Slots>) => {
  const { context: uniformContext } = useUniformContext();
  const onClick = async (e: any) => {
    e.preventDefault();
    await uniformContext?.update({
      quirks: {
        city: "San Francisco",
        persona: "Shopper",
      },
    });
  };

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
      <UniformText
        component={component}
        context={context}
        parameterId="description"
        className="description"
        placeholder="Enter hero description"
      />
      <button onClick={onClick}>Set quirks</button>
    </>
  );
};
