import {
  registerUniformComponent,
  UniformSlot,
  type ComponentProps,
} from "@uniformdev/canvas-react";
import Header from "./Header";
import Footer from "./Footer";

type PageProps = ComponentProps;

const Page: React.FC<PageProps> = () => (
  <div>
    <Header />
    <UniformSlot name="pageContent" />
    <Footer />
  </div>
);

registerUniformComponent({
  type: "page",
  component: Page,
});

registerUniformComponent({
  type: "searchDemoPage",
  component: Page,
});

export default Page;
