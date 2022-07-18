export const CANVAS_MONSTER_LIST_PARAMETER_TYPES = ["monster-list"];

export function createMonsterEnhancer(client) {
  return async ({ parameter }) => {
    const { type, value } = parameter;
    if (type == CANVAS_MONSTER_LIST_PARAMETER_TYPES[0]) {
      const { index } = value;
      const monster = await client.getMonster(index);
      if (monster?.index == index) {
        return monster;
      }
    }
    return value;
  };
}
