import { FC } from "react";
import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import { ContainerParameters } from "@/components/canvas/Container";
import BaseFlex from "@/components/ui/Flex";
import { ViewPort } from "@/utils/types";
import { ResolveComponentResultWithType } from "@/uniform/models";

type Direction = "row" | "row-reverse" | "col" | "col-reverse";
type Justify = "start" | "end" | "center" | "between";
type AvailableGap = "2" | "8" | "16";
type Align = "start" | "end" | "center" | "stretch";
export type FlexParameters = ContainerParameters & {
  direction?: Direction | ViewPort<Direction>;
  justifyContent?: Justify | ViewPort<Justify>;
  gap?: AvailableGap | ViewPort<AvailableGap>;
  alignItems?: Align | ViewPort<Align>;
};
enum FlexSlots {
  FlexItem = "flexItem",
}

type FlexProps = ComponentProps<FlexParameters, FlexSlots>;

const Flex: FC<FlexProps> = ({
  direction,
  justifyContent,
  gap,
  alignItems,
  spacing,
  fluidContent,
  fullHeight,
  slots,
  component,
  context,
}) => (
  <BaseFlex
    {...{
      direction,
      justifyContent,
      gap,
      alignItems,
      spacing,
      fluidContent,
      fullHeight,
    }}
  >
    <UniformSlot data={component} context={context} slot={slots.flexItem} />
  </BaseFlex>
);

export const flexMapping: ResolveComponentResultWithType = {
  type: "flex",
  component: Flex,
};

export default Flex;
