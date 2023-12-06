"use client";

import { useEffect } from "react";
import { useUniformContext } from "@uniformdev/canvas-next-rsc/component";

const TrackerScoreSync = () => {
  const { context } = useUniformContext();
  useEffect(() => {
    const fetchTraits = async () => {
      const response = await fetch("/api/traits");
      if (response.ok) {
        const { traits } = await response.json();
        await context?.update({
          quirks: {
            ...traits,
          },
        });
      } else {
        console.log("No traits returned.");
      }
    };
    fetchTraits();
  }, [context]);
  return null;
};

export default TrackerScoreSync;
