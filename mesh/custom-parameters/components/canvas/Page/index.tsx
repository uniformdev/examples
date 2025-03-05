import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";

export const PageComponent = ({
  component,
  context,
  slots,
}: ComponentProps<PageProps, Slots>) => {
  return (
    <UniformSlot context={context} data={component} slot={slots.content} />
  );
};

export type PageProps = {};

export type Slots = "content";

export const pageMapping: ResolveComponentResultWithType = {
  type: "page",
  component: PageComponent,
};
