import {
  type ComponentProps,
  registerUniformComponent,
  NOT_IMPLEMENTED_COMPONENT,
} from "@uniformdev/canvas-react";

export function DefaultNotFoundComponent({ component }: ComponentProps) {
  const type = component?.type ?? "unknown";
  return <div>Not Found: {type}</div>;
}

registerUniformComponent({
  type: NOT_IMPLEMENTED_COMPONENT,
  component: DefaultNotFoundComponent,
});
