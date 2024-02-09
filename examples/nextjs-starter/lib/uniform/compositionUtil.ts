import {
  CANVAS_PERSONALIZE_SLOT,
  CANVAS_PERSONALIZE_TYPE,
  CANVAS_TEST_SLOT,
  CANVAS_TEST_TYPE,
  RootComponentInstance,
  walkNodeTree,
} from "@uniformdev/canvas";

export function assignTrackingAttributes(composition: RootComponentInstance) {
  if (!composition) {
    return;
  }
  walkNodeTree(composition, ({ node, type, actions }) => {
    if (type !== "component") {
      actions.stopProcessingDescendants();
      return;
    }

    if (node.type === CANVAS_PERSONALIZE_TYPE) {
      const slot = node.slots?.[CANVAS_PERSONALIZE_SLOT];

      slot?.forEach((component) => {
        component.parameters = {
          ...component.parameters,
          trackingEventName: node.parameters?.["trackingEventName"]!,
        };
      });
    } else if (node.type === CANVAS_TEST_TYPE) {
      const slot = node.slots?.[CANVAS_TEST_SLOT];

      slot?.forEach((component) => {
        component.parameters = {
          ...component.parameters,
          test: node.parameters?.["test"]!,
        };
      });
    }
  });
}
