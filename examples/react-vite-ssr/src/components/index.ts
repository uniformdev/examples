import { registerUniformComponent } from "@uniformdev/canvas-react";
import Page from "./Page";
import Hero from "./Hero";

registerUniformComponent({
  type: "page",
  component: Page,
});

registerUniformComponent({
  type: "hero",
  component: Hero,
});
