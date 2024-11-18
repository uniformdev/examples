import { HTMLAttributes } from 'react';
import { ViewPort } from '@/utils/types';

export type SpaceType = Pick<
  NonNullable<HTMLAttributes<HTMLDivElement>['style']>,
  | 'marginTop'
  | 'marginLeft'
  | 'paddingTop'
  | 'marginRight'
  | 'paddingLeft'
  | 'marginBottom'
  | 'paddingRight'
  | 'paddingBottom'
>;

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: string;
  spacing?: SpaceType | ViewPort<SpaceType>;
  border?: string | ViewPort<string>;
  fluidContent?: boolean;
  fullHeight?: boolean;
};

export { Container as default } from './Container';
