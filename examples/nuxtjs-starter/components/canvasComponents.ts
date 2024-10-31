import type { ComponentInstance } from "@uniformdev/canvas";
import {
  DefaultNotImplementedComponent,
  type ResolveRenderer,
} from "@uniformdev/canvas-vue";
import Page from "./Page.vue";
import Hero from "./Hero.vue";

// register your new components here
const componentMap = {
  hero: Hero,
  page: Page,
};

export const resolveRenderer: ResolveRenderer = (component) => {
  return (
    componentMap[component.type as keyof typeof componentMap] ??
    DefaultNotImplementedComponent
  );
};
