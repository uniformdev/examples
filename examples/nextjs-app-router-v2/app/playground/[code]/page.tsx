import {
  resolvePlaygroundRoute,
  UniformPageParameters,
  UniformPlayground,
} from "@uniformdev/canvas-next-rsc-v2";
import { resolveComponent } from "@/components/resolveComponent";

export default async function PlaygroundPage(props: UniformPageParameters) {
  const result = await resolvePlaygroundRoute(props);
  return (
    <UniformPlayground route={result} resolveComponent={resolveComponent} />
  );
}
