import { useUniformContext } from "@uniformdev/context-react";
import { useEffect } from "react";

export default function DevelopersPage() {
  const { context } = useUniformContext();

  // Setting enrichments for the audience category
  useEffect(() => {
    context.update({
      enrichments: [
        {
          cat: "audience",
          key: "dev",
          str: 10,
        },
      ],
    });
  }, [context]);

  return (
    <div>
      <h2>For Developers page</h2>
    </div>
  );
}
