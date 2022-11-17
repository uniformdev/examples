import { ComponentInstance } from "@uniformdev/canvas";
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-vue";

import Hero from "./Hero.vue";

const mapping = {
  hero: Hero,
};

export function resolveRenderer(componentInstance: ComponentInstance) {
  return mapping[componentInstance.type] ?? DefaultNotImplementedComponent;
}

export default mapping;
