import { FC } from 'react';
import { ComponentProps, UniformSlot } from '@uniformdev/canvas-next-rsc/component';
import BaseGridItem from '@/components/ui/GridItem';
import { ViewPort } from '@/utils/types';
import { ResolveComponentResultWithType } from '@/uniform/models';

type AvailableGridItemColumnsCount = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type AvailableGridItemSpan =
  | 'auto'
  | 'span-1'
  | 'span-2'
  | 'span-3'
  | 'span-4'
  | 'span-5'
  | 'span-6'
  | 'span-7'
  | 'span-8'
  | 'span-9'
  | 'span-10'
  | 'span-11'
  | 'span-12'
  | 'span-full';
type AvailableGridItemRowStart = '1' | '2' | '3' | '4' | '5' | '6';
export type GridItemParameters = {
  displayName?: string;
  columnStart?: AvailableGridItemColumnsCount | ViewPort<AvailableGridItemColumnsCount>;
  columnSpan?: AvailableGridItemSpan | ViewPort<AvailableGridItemSpan>;
  rowStart?: AvailableGridItemRowStart | ViewPort<AvailableGridItemRowStart>;
  rowSpan?: AvailableGridItemSpan | ViewPort<AvailableGridItemSpan>;
};
enum GridItemSlots {
  Inner = 'inner',
}

type GridProps = ComponentProps<GridItemParameters, GridItemSlots>;

const GridItem: FC<GridProps> = ({ columnStart, columnSpan, rowStart, rowSpan, context, component, slots }) => (
  <BaseGridItem {...{ columnStart, columnSpan, rowStart, rowSpan }}>
    <UniformSlot data={component} context={context} slot={slots.inner} />
  </BaseGridItem>
);

export const gridItemMapping: ResolveComponentResultWithType = {
  type: "gridItem",
  component: GridItem,
};

export default GridItem;
