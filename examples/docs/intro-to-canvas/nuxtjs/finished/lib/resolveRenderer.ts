import { type ComponentInstance } from "@uniformdev/canvas";
import Body from "../components/Body.vue";
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-vue";

export default function resolveRenderer({ type }: ComponentInstance) {
  if (type == "defaultBody") {
    return Body;
  }
  return DefaultNotImplementedComponent;
}
