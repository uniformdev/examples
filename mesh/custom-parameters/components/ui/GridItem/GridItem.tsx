import { FC } from 'react';
import { cn, resolveViewPort } from '@/utils';
import { GridItemProps } from '.';

export const GridItem: FC<GridItemProps> = ({ className, columnStart, columnSpan, rowStart, rowSpan, children }) => (
  <div
    className={cn(
      {
        [resolveViewPort(columnStart, 'col-start-{value}')]: columnStart,
        [resolveViewPort(columnSpan, 'col-{value}')]: columnSpan,
        [resolveViewPort(rowStart, 'row-start-{value}')]: rowStart,
        [resolveViewPort(rowSpan, 'row-{value}')]: rowSpan,
      },
      className
    )}
  >
    {children}
  </div>
);
