import { FC } from 'react';
import { cn, resolveViewPort } from '@/utils';
import { TextProps } from './';

export const Text: FC<TextProps> = ({
  className,
  size,
  color,
  weight,
  font,
  transform = '',
  decoration = '',
  letterSpacing,
  alignment,
  children,
  lineCountRestrictions,
}) => {
  const baseStyles = cn(
    {
      [`text-${color}`]: !!color,
      [`font-${font}`]: !!font,
      [resolveViewPort(size, 'text-{value}')]: size,
      [`font-${weight}`]: !!weight,
      [`text-${alignment}`]: !!alignment,
      [transform]: !!transform,
      [decoration]: !!decoration,
      [`tracking-${letterSpacing}`]: !!letterSpacing,
      [resolveViewPort(lineCountRestrictions, 'line-clamp-{value}')]: lineCountRestrictions,
    },
    className
  );
  if (typeof children === 'string') {
    return <span className={baseStyles}>{children}</span>;
  }
  const childProps = children.props as Record<string, unknown>;
  return (
    <children.type {...childProps} className={cn(baseStyles, childProps.className as string)} />
  );
};
