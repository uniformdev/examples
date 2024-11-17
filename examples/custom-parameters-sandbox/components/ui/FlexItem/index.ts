import { HTMLAttributes } from 'react';
import { ViewPort } from '@/types';

type AvailableAlignSelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';
type AvailableShrink = '0' | '1';

export type FlexItemProps = HTMLAttributes<HTMLDivElement> & {
  alignSelf?: AvailableAlignSelf | ViewPort<AvailableAlignSelf>;
  shrink: AvailableShrink;
};

export { FlexItem as default } from './FlexItem';
