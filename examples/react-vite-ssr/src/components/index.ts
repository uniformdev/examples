import { registerUniformComponent } from "@uniformdev/canvas-react";
import Page from "./Page";
import FeaturedProduct from "./FeaturedProduct";
import ProductGallery from "./ProductGallery";
import SectionContainer from "./SectionContainer";

registerUniformComponent({
  type: "page",
  component: Page,
});

registerUniformComponent({
  type: "featuredProduct",
  component: FeaturedProduct,
});

registerUniformComponent({
  type: "productGallery",
  component: ProductGallery,
});

registerUniformComponent({
  type: "sectionContainer",
  component: SectionContainer,
});
