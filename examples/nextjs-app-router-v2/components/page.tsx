import { ComponentProps, UniformSlot } from '@uniformdev/canvas-next-rsc-v2/component';

import { QuirkButton } from './custom/QuirkButton';

export type PageProps = unknown;
export type PageSlots = 'content' | 'header' | 'footer';

export const Page = ({ slots }: ComponentProps<PageProps, PageSlots>) => {
  return (
    <>
      <UniformSlot slot={slots.header} />
      <UniformSlot slot={slots.content} />
      <UniformSlot slot={slots.footer} />

      <div>
        <QuirkButton />
      </div>
    </>
  );
};
