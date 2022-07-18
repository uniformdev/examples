import React, { useEffect, useState } from "react";
import MonsterDetails from "../components/MonsterDetails";

export default {
  title: "Basic Integration/Monster Details",
  component: MonsterDetails,
  argTypes: {
    index: {
      name: "monster",
      type: { required: true },
    },
    host: {
      type: { required: true },
    },
  },
  parameters: { controls: { sort: "requiredFirst" } },
};

export const MonsterLookup = Template.bind({});
MonsterLookup.args = {
  index: "adult-black-dragon",
  color: "rgba(255, 127, 63)",
  height: "250px",
  width: "250px",
  label: "Points",
  host: "https://www.dnd5eapi.co",
};

function Template(args) {
  const { index, host } = args;
  const [monster, setMonster] = useState();
  useEffect(() => {
    if (!index || index.trim().length == 0) {
      setMonster();
      return;
    }
    async function loadMonster() {
      const response = await fetch(`${host}/api/monsters/${index}`);
      const json = await response.json();
      setMonster(json);
    }
    loadMonster();
  }, [index]);
  return <MonsterDetails {...args} monster={monster} />;
}
