import { ComponentProps } from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type FooterProps = {};

export const FooterComponent = ({
  component,
  context,
}: ComponentProps<FooterProps>) => {
  return <h1>Footer</h1>
};

export const footerMapping: ResolveComponentResultWithType = {
  type: "footer",
  component: FooterComponent,
};
