import {
  CANVAS_PERSONALIZE_SLOT,
  CANVAS_PERSONALIZE_TYPE,
  ComponentInstance,
  RootComponentInstance,
  mapSlotToPersonalizedVariations,
  walkNodeTree,
} from "@uniformdev/canvas";

interface Criteria {
  l: string;
  op: string;
  rDim: string;
}

const processPersonalizationContainers = ({
  component,
  uniqueAudiences,
}: {
  component: ComponentInstance;
  uniqueAudiences: Map<string, Criteria[]>;
}): ComponentInstance | undefined => {
  const pz = component.slots?.[CANVAS_PERSONALIZE_SLOT] || [];
  const newComponent = { ...component };
  newComponent.slots[CANVAS_PERSONALIZE_SLOT] = pz.map((c) => {
    const updatedVariant = { ...c };
    const currentPzCriteriaArray =
      updatedVariant.parameters["$pzCrit"]?.value?.crit;
    if (
      currentPzCriteriaArray &&
      Array.isArray(currentPzCriteriaArray) &&
      currentPzCriteriaArray.length > 0
    ) {
      const currentCriteria = currentPzCriteriaArray?.[0]?.l;
      // console.log({ currentCriteria });
      const additionalCriteria = uniqueAudiences.get(currentCriteria);

      updatedVariant.parameters["$pzCrit"]?.value?.crit?.push(
        ...additionalCriteria
      );
    }

    return updatedVariant;
  });

  return component;
};

export function processComposition(composition: RootComponentInstance) {
  walkNodeTree(composition, (node) => {
    if (node.type === "component") {
      const component = node.node;
      let replacement:
        | ComponentInstance
        | ComponentInstance[]
        | null
        | undefined;

      if (component.type === CANVAS_PERSONALIZE_TYPE) {
        const pz = component.slots?.[CANVAS_PERSONALIZE_SLOT] || [];
        const variations = mapSlotToPersonalizedVariations(pz);
        const audiences = [];
        variations.forEach((v) =>
          v.pz?.crit.forEach((c) => {
            if (c.l) {
              audiences.push(c.l);
            }
          })
        );

        let audienceSet = new Set(audiences);
        let uniqueAudiences = Array.from(audienceSet.values());
        const criteriaMap: Map<string, Criteria[]> = new Map();
        uniqueAudiences.forEach((audience) => {
          criteriaMap.set(
            audience,
            uniqueAudiences
              .filter((a) => a !== audience)
              .map((a) => {
                return { l: audience, op: ">=", rDim: a };
              })
          );
        });

        replacement = processPersonalizationContainers({
          component,
          uniqueAudiences: criteriaMap,
        });
      }

      if (typeof replacement !== "undefined") {
        if (replacement === null) {
          node.actions.remove();
        } else {
          if (!Array.isArray(replacement)) {
            node.actions.replace(replacement);
          } else {
            const [first, ...rest] = replacement;

            node.actions.replace(first);

            if (rest.length > 0) {
              node.actions.insertAfter(rest);
            }
          }
        }
      }
    }
  });
  return composition;
}
