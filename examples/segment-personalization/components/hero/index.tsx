import {
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { Parameters, Slots } from "./props";
import TrackerScoreSync from "../tracker-score-sync";

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
      <UniformText
        component={component}
        context={context}
        parameterId="description"
        className="description"
        placeholder="Enter hero description"
      />
      <TrackerScoreSync />
    </>
  );
};
