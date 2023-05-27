// returns the highest scored enrichment in the persona enrichment category
export function getHighestScoredPersonaEnrichment(scores: {
  [key: string]: number;
}) {
  const traits = Object.keys(scores)
    .filter((k) => k.startsWith("p_"))
    .map((k) => {
      let personaName = k;
      // setting friendly names
      if (personaName === "p_d") {
        personaName = "Developer";
      } else if (personaName === "p_m") {
        personaName = "Marketer";
      }
      return { name: personaName, score: scores[k] };
    });

  if (traits.length <= 0) {
    return undefined;
  }

  traits.sort((a, b) => b.score - a.score);
  return traits[0]?.name;
}
