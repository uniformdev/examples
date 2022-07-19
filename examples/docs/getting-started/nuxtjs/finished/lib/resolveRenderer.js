import Body from "../src/components/Body";
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-vue";

export default function resolveRenderer({ type }) {
  if (type == "defaultBody") {
    return Body;
  }
  return DefaultNotImplementedComponent;
}
