import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/next-app-router/component";

export type PageProps = unknown;
export type PageSlots = "content" | "header" | "footer";

export const Page = ({ slots }: ComponentProps<PageProps, PageSlots>) => {
  return (
    <>
      <UniformSlot slot={slots.header} />
      <UniformSlot slot={slots.content} />
      <UniformSlot slot={slots.footer} />
    </>
  );
};
