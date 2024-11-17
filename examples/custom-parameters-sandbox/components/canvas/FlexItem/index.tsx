import { FC } from "react";
import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import BaseFlexItem from "@/components/ui/FlexItem";
import { ViewPort } from "@/utils/types";
import { ResolveComponentResultWithType } from "@/uniform/models";

type AvailableAlignSelf = "auto" | "start" | "end" | "center" | "stretch";
type AvailableShrink = "0" | "1";

export type FlexItemParameters = {
  displayName?: string;
  alignSelf?: AvailableAlignSelf | ViewPort<AvailableAlignSelf>;
  shrink: AvailableShrink;
};
enum FlexItemSlots {
  Inner = "inner",
}

type FlexProps = ComponentProps<FlexItemParameters, FlexItemSlots>;

const FlexItem: FC<FlexProps> = ({
  alignSelf,
  shrink,
  context,
  component,
  slots,
}) => (
  <BaseFlexItem {...{ alignSelf, shrink }}>
    <UniformSlot data={component} context={context} slot={slots.inner} />
  </BaseFlexItem>
);

export const flexItemMapping: ResolveComponentResultWithType = {
  type: "flexItem",
  component: FlexItem,
};

export default FlexItem;
