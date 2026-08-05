import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/next-app-router/component";

export type PageProps = unknown;
export type PageSlots = "content" | "header" | "footer";

export const Page = ({ slots }: ComponentProps<PageProps, PageSlots>) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-4">
          <UniformSlot slot={slots.header} />
        </div>
      </header>
      <main className="flex-1">
        <UniformSlot slot={slots.content} />
      </main>
      <footer className="mt-auto border-t border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <UniformSlot slot={slots.footer} />
        </div>
      </footer>
    </div>
  );
};
