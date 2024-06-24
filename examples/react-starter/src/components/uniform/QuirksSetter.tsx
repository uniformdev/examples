import { useUniformContext } from "@uniformdev/context-react";
import React from "react";

export default function QurksSetter() {
  const { context } = useUniformContext();

  const fetchNearestArea = async (uniformContext: any) => {
    await uniformContext.update({
      quirks: {
        latitude: "123",
        longitude: "456",
      },
    });
  };

  React.useEffect(() => {
    fetchNearestArea(context);
  }, [context]);

  return (
    <>
      <pre>
        {JSON.stringify(
          { quirks: context.quirks, scores: context.scores },
          null,
          2
        )}
      </pre>
      {/* <button
        onClick={async () => {
          await fetchNearestArea();
        }}
      >Load</button> */}
    </>
  );
}
