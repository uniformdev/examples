import { FC } from 'react';
import { cn, resolveViewPort } from '@/utils';
import { GridProps } from '.';
import Container from '../Container';

export const Grid: FC<GridProps> = ({
  className,
  columnsCount,
  gapX,
  gapY,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  fullHeight,
  children,
}) => (
  <Container {...{ backgroundColor, spacing, border, fluidContent, fullHeight }}>
    <div
      className={cn(
        'grid',
        {
          [resolveViewPort(columnsCount, 'grid-cols-{value}')]: columnsCount,
          [resolveViewPort(gapX, 'gap-x-{value}')]: gapX,
          [resolveViewPort(gapY, 'gap-y-{value}')]: gapY,
        },
        className
      )}
    >
      {children}
    </div>
  </Container>
);
