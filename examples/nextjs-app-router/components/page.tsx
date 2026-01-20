import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";

export const PageComponent = ({
  component,
  context,
  slots,
}: ComponentProps<PageProps, PageSlots>) => {
  return (
    <>
      <UniformSlot context={context} data={component} slot={slots.header} />
      <UniformSlot context={context} data={component} slot={slots.content} />
      <UniformSlot context={context} data={component} slot={slots.footer} />
    </>
  );
};

type PageProps = {};
type PageSlots = "content" | "header" | "footer";