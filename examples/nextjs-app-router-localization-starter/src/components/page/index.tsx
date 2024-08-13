import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import { Parameters, Slots } from "./props";

export const PageComponent = ({
  component,
  context,
  slots,
}: ComponentProps<Parameters, Slots>) => {
  return (
    <UniformSlot context={context} data={component} slot={slots.content} />
  );
};
