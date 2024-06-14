import { useUniformContext } from "@uniformdev/context-react";

export default function QuirksGetter() {
  const { context } = useUniformContext();

  return <div>{JSON.stringify(context.quirks, null, 2)}</div>;
}
