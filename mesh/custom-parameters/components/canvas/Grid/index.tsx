import { FC } from "react";
import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import { ContainerParameters } from "@/components/canvas/Container";
import BaseGrid from "@/components/ui/Grid";
import { ViewPort } from "@/utils/types";
import { ResolveComponentResultWithType } from "@/uniform/models";

type AvailableGridColumnsCount =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";
type AvailableGridGap = "2" | "8" | "16";
export type GridParameters = ContainerParameters & {
  columnsCount?:
  | AvailableGridColumnsCount
  | ViewPort<AvailableGridColumnsCount>;
  gapY?: AvailableGridGap | ViewPort<AvailableGridGap>;
  gapX?: AvailableGridGap | ViewPort<AvailableGridGap>;
};
enum GridSlots {
  GridInner = "gridInner",
}

type GridProps = ComponentProps<GridParameters, GridSlots>;

const Grid: FC<GridProps> = ({
  columnsCount,
  gapX,
  gapY,
  spacing,
  fluidContent,
  fullHeight,
  slots,
  component,
  context,
}) => (
  <BaseGrid
    {...{
      columnsCount,
      gapX,
      gapY,
      spacing,
      fluidContent,
      fullHeight,
    }}
  >
    <UniformSlot data={component} context={context} slot={slots.gridInner} />
  </BaseGrid>
);

export const gridMapping: ResolveComponentResultWithType = {
  type: "grid",
  component: Grid,
};

export default Grid;
