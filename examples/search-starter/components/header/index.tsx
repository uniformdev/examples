import { ComponentProps } from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type HeaderProps = {};

export const HeaderComponent = ({
  component,
  context,
}: ComponentProps<HeaderProps>) => {
  return <h1>Header</h1>
};

export const headerMapping: ResolveComponentResultWithType = {
  type: "header",
  component: HeaderComponent,
};
