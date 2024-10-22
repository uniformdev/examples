import { UniformPlayground } from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";

export default function PlaygroundPage(props: any) {
  return <UniformPlayground {...props} resolveComponent={resolveComponent} />;
}
