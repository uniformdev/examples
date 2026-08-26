import {
  registerUniformComponent,
  UniformSlot,
  type ComponentProps,
} from "@uniformdev/canvas-react";

type PageProps = ComponentProps;

const Page: React.FC<PageProps> = () => (
  <div>
    <UniformSlot name="content" />
  </div>
);

registerUniformComponent({
  type: "page",
  component: Page,
});

export default Page;
