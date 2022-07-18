import React, { useEffect, useState } from "react";
import AbilityScores from "../components/AbilityScores";

export default {
  title: "Basic Integration/Ability Scores",
  component: AbilityScores,
  argTypes: {
    index: {
      name: "monster",
      type: { required: true },
    },
    host: {
      name: "host",
      type: { required: true },
    },
    scores: {
      table: { disable: true },
    },
  },
  parameters: { controls: { sort: "requiredFirst" } },
};

export const MonsterLookup = Template.bind({});
MonsterLookup.args = {
  host: "https://www.dnd5eapi.co",
  index: "adult-black-dragon",
  color: "rgba(255, 127, 63)",
  label: "Points",
  height: "250px",
  width: "250px",
};

function Template(args) {
  const { index, host } = args;
  const [scores, setScores] = useState();
  useEffect(() => {
    if (!index || index.trim().length == 0) {
      setScores();
      return;
    }
    async function loadMonster() {
      const response = await fetch(`${host}/api/monsters/${index}`);
      const monster = await response.json();
      const newScores = getScoresFromMonster(monster);
      setScores(newScores);
    }
    loadMonster();
  }, [index]);
  return <AbilityScores {...args} scores={scores} />;
}

function getScoresFromMonster(monster) {
  if (!monster) return;
  const { strength, dexterity, constitution, intelligence, wisdom, charisma } =
    monster;
  return {
    Strength: strength,
    Dexterity: dexterity,
    Constitution: constitution,
    Intelligence: intelligence,
    Wisdom: wisdom,
    Charisma: charisma,
  };
}
