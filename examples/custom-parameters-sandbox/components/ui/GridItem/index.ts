import { HTMLAttributes } from 'react';
import { DefaultTheme } from 'tailwindcss/types/generated/default-theme';
import { ViewPort } from '@/types';

type AvailableColumnStart = keyof DefaultTheme['gridColumnStart'];
type AvailableColumnSpan = keyof DefaultTheme['gridColumn'];
type AvailableGridRowStart = keyof DefaultTheme['gridRowStart'];
type AvailableGridRowSpan = keyof DefaultTheme['gridRow'];

export type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  columnStart?: AvailableColumnStart | ViewPort<AvailableColumnStart>;
  columnSpan?: AvailableColumnSpan | ViewPort<AvailableColumnSpan>;
  rowStart?: AvailableGridRowStart | ViewPort<AvailableGridRowStart>;
  rowSpan?: AvailableGridRowSpan | ViewPort<AvailableGridRowSpan>;
};

export { GridItem as default } from './GridItem';
