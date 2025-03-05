import { FC } from 'react';
import { cn, resolveViewPort } from '@/utils';
import { FlexProps } from '.';
import Container from '../Container';

export const Flex: FC<FlexProps> = ({
  className,
  direction,
  justifyContent,
  gap,
  alignItems,
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
        'flex',
        {
          [resolveViewPort(direction, 'flex-{value}')]: direction,
          [resolveViewPort(justifyContent, 'justify-{value}')]: justifyContent,
          [resolveViewPort(gap, 'gap-{value}')]: gap,
          [resolveViewPort(alignItems, 'items-{value}')]: alignItems,
        },
        className
      )}
    >
      {children}
    </div>
  </Container>
);
