import { useUniformContext } from "@uniformdev/context-react";
import { useEffect, useMemo } from "react";

export default function Support() {
  const { context } = useUniformContext();

  // create an enrichment array (could be a single enrichment too if needed)
  const enrichments = useMemo(() => {
    const categories = ["sup"];
    return (
      categories?.map((c: string) => ({
        cat: "int",
        key: c,
        str: 5,
      })) || []
    );
  }, []);

  // passing new enrichments with values to the context
  useEffect(() => {
    context.update({ enrichments });
  }, [context, enrichments]);

  return (
    <div>
      <h2>Support page</h2>
    </div>
  );
}
