import {
  UniformPlayground,
  UniformPlaygroundProps,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/lib/uniform/componentResolver";

export default async function PlaygroundPage(props: {
  searchParams: Promise<UniformPlaygroundProps["searchParams"]>;
}) {
  const searchParams = await props.searchParams;
  return <UniformPlayground searchParams={searchParams} resolveComponent={resolveComponent} />;
}
