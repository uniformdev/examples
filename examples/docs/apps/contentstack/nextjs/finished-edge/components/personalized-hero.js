import React from "react";
import { Personalize } from "@uniformdev/context-react";

function Hero({ message, title }) {
  return (
    <div>
      <div className="personalized-hero">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

function reshape(variations) {
  if (!variations) return;
  let i = 0;
  return variations.map((variation) => {
    const { personalization_criteria, ...fixed } = variation;
    fixed.pz = variation.personalization_criteria?.name;
    fixed.id = i++;
    return fixed;
  });
}

export default function PersonalizedHero({ variations }) {
  return (
    <div>
      <Personalize variations={reshape(variations)} component={Hero} />
    </div>
  );
}
