import { useUniformContext } from "@uniformdev/context-react";

export default function QuirksGetter() {
  const { context } = useUniformContext();
  return (
    <div>
      {JSON.stringify(
        { quirks: context.quirks, scores: context.scores },
        null,
        2
      )}
    </div>
  );
}
