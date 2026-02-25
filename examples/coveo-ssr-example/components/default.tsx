import { ComponentProps } from '@uniformdev/next-app-router/component';

export const DefaultNotFoundComponent = ({ type }: ComponentProps) => {
  return <div>Not Found: {type}</div>;
};
