import { ComponentProps } from '@uniformdev/canvas-next-rsc-v2/component';

export const DefaultNotFoundComponent = ({ type }: ComponentProps) => {
  return <div>Not Found: {type}</div>;
};
