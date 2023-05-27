import { useEffect } from "react";
import { useScores } from "@uniformdev/context-react";
import { getHighestScoredPersonaEnrichment } from "lib/uniform/enrichments";

const TrackerScoreSync = () => {
  const scores = useScores();
  console.log("TrackerScoreSync", { scores });
  useEffect(() => {
    const persona = getHighestScoredPersonaEnrichment(scores);
    if (persona) {
      console.log("Setting persona trait", { persona });
      global.analytics.identify("", {
        persona,
      });
    }
  }, [scores]);

  return null;
};

export default TrackerScoreSync;
