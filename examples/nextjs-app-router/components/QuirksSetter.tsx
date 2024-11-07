"use client";

import { useEffect } from "react";
import { useUniformContext } from "@uniformdev/canvas-next-rsc/component";
import { useQuirks } from "@uniformdev/canvas-next-rsc-client";

// example of a client-side quirks setter
export const QuirksSetter = () => {
  const { context } = useUniformContext();
  const quirks = useQuirks();

  useEffect(() => {
    context?.update({
      quirks: {
        // this value can come from another fetch (typically a CDP or profile endpoint)
        audience: "loyal customer",
      },
    });
  }, [context]);

  return (
    <div>
      <strong>Current quirks:</strong>
      <pre>{JSON.stringify(quirks)}</pre>
    </div>
  );
};
