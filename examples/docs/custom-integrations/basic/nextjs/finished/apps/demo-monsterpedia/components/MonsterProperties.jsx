import React from "react";

export default function MonsterProperties({ monster }) {
  const data = getData(monster);
  if (!data) {
    return <div />;
  };
  return (
    <div className="w-80">
      <table>
        <tbody>
          {Object.keys(data).map((key) => (
            <tr key={key}>
              <td className="font-bold align-top text-right pr-2 pb-1.5">{key}:</td>
              <td className="align-top">{data[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getData(monster) {
  if (!monster) return;
  const abilities = getNamesAsString(monster.special_abilities);
  const actions = getNamesAsString(monster.actions);
  const legendaryActions = getNamesAsString(monster.legendary_actions);
  const data = {};
  if (monster.size) data["Size"] = monster.size;
  if (monster.alignment) data["Alignment"] = monster.alignment;
  if (monster.languages) data["Languages"] = monster.languages;
  if (abilities) data["Special abilities"] = abilities;
  if (actions) data["Actions"] = actions;
  if (legendaryActions) data["Legendary actions"] = legendaryActions;
  return data;
}

function getNamesAsString(prop) {
  if (Array.isArray(prop) && prop.length > 0) {
    return prop.map(value => value.name).join(", ");
  }
}