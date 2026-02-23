import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/next-app-router/component";

import { QuirkButton } from "./custom/QuirkButton";
import WebVitals from "./custom/WebVitals";

export type PageProps = unknown;
export type PageSlots = "content" | "header" | "footer";

export const Page = ({ slots }: ComponentProps<PageProps, PageSlots>) => {
  return (
    <>
      <UniformSlot slot={slots.header} />
      <UniformSlot slot={slots.content} />
      <div>
        <QuirkButton />
      </div>
      <UniformSlot slot={slots.footer} />
      <WebVitals />
    </>
  );
};
