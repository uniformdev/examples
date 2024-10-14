import { useUniformContext } from "@uniformdev/context-react";
import { useEffect } from "react";

export default function MarketersPage() {
  const { context } = useUniformContext();

  // Setting enrichments for the audience category
  useEffect(() => {
    context.update({
      enrichments: [
        {
          cat: "audience",
          key: "mkgt",
          str: 10,
        },
      ],
    });
  }, [context]);

  return (
    <div>
      <h2>For Marketers page</h2>
    </div>
  );
}
