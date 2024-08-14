import {
  UniformPlayground,
  UniformPlaygroundProps,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/lib/uniform/componentResolver";

export default function PlaygroundPage(props: UniformPlaygroundProps) {
  console.log("🧪 PlaygroundPage", props);
  return <UniformPlayground {...props} resolveComponent={resolveComponent} />;
}
