import React from "react";
import AbilityScores from "./AbilityScores";
import MonsterProperties from "./MonsterProperties";

export default function MonsterDetails({
  monster,
  height = "250px",
  width = "250px",
  color,
  label,
}) {
  if (!monster) {
    return <div />;
  }
  const { strength, dexterity, constitution, intelligence, wisdom, charisma } =
    monster;
  const scores = {
    Strength: strength,
    Dexterity: dexterity,
    Constitution: constitution,
    Intelligence: intelligence,
    Wisdom: wisdom,
    Charisma: charisma,
  };
  const { name } = monster;
  return (
    <div className="max-w-7xl mx-auto text-center py-1 px-4 sm:px-6 lg:py-4 lg:px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-neutral-500 sm:text-4xl">
        <span className="block">{name}</span>
      </h2>
      <div className="mt-2 flex flex-row justify-center">
        <div>
          <AbilityScores
            scores={scores}
            height={height}
            width={width}
            color={color}
            label={label}
          />
        </div>
        <div className="text-sm text-left rounded-xl shadow-md mx-5 p-4 bg-gray-100">
          <MonsterProperties monster={monster} />
        </div>
      </div>
    </div>
  );
}
