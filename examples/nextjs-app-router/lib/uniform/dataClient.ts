import {
  DefaultDataClient,
  type EnhanceRouteOptions,
} from "@uniformdev/next-app-router";
import type { ComponentParameter } from "@uniformdev/next-app-router/component";
import {
  CANVAS_COMPONENT_DISPLAY_NAME_PARAM,
  walkNodeTree,
  type ComponentInstance,
} from "@uniformdev/canvas";

/** Value of the `parentComponent` parameter added to every child component. */
export type ParentComponentData = {
  id: string | undefined;
  type: string;
  name: string;
};

/**
 * Parameter id the parent info is written to. next-app-router v2 passes every
 * composition parameter to React components as `parameters.<id>`, but does NOT
 * pass `component.data`, so a classic `.data()` enhancer would be invisible to
 * components. Writing a parameter is the way to get it through.
 */
export const PARENT_PARAMETER_ID = "parentComponent";

/** Add this to a component's props type to read the parent info. */
export type WithParentComponent = {
  parentComponent?: ComponentParameter<ParentComponentData>;
};

/**
 * Parameter id holding the name of the slot this component sits in on its
 * nearest non-system parent. Unlike `component.slotName`, it skips
 * $personalization / $test / $slotSection wrappers (whose slots are `pz`,
 * `test`, `$slotSectionItems`) and reports the slot on the real parent.
 */
export const PARENT_SLOT_PARAMETER_ID = "parentSlotName";

/** Add this to a component's props type to read the parent slot name. */
export type WithParentSlotName = {
  parentSlotName?: ComponentParameter<string>;
};

// System components ($personalization, $test, $slotSection, ...) are skipped so
// a child (including every personalization / A/B test variation) always points
// at its nearest "real" parent component.
const isSystemComponent = (component: ComponentInstance) =>
  component.type.startsWith("$");

const getComponentName = (component: ComponentInstance): string => {
  const displayName =
    component.parameters?.[CANVAS_COMPONENT_DISPLAY_NAME_PARAM]?.value;
  return typeof displayName === "string" && displayName
    ? displayName
    : component.type;
};

const addParentParameters = (composition: ComponentInstance) => {
  walkNodeTree(composition, ({ type, node, ancestorsAndSelf, actions }) => {
    if (type !== "component") {
      actions.stopProcessingDescendants();
      return;
    }

    // ancestorsAndSelf[0] is the node itself, [1] its parent, and so on.
    const parentIndex = ancestorsAndSelf.findIndex(
      (ancestor, index) =>
        index > 0 && !isSystemComponent(ancestor.node as ComponentInstance)
    );
    if (parentIndex < 1) return;

    const parent = ancestorsAndSelf[parentIndex].node as ComponentInstance;
    // ancestorsAndSelf[i].parentSlot is the slot on ancestorsAndSelf[i + 1]
    // containing ancestorsAndSelf[i], so the entry just below the parent (the
    // node itself or its outermost system wrapper) holds the parent's slot.
    const location = ancestorsAndSelf[parentIndex - 1];
    const parentSlotName =
      location.type === "slot" ? location.parentSlot : undefined;

    const value: ParentComponentData = {
      id: parent._id,
      type: parent.type,
      name: getComponentName(parent),
    };
    node.parameters = {
      ...node.parameters,
      [PARENT_PARAMETER_ID]: { type: "json", value },
      ...(parentSlotName && {
        [PARENT_SLOT_PARAMETER_ID]: { type: "text", value: parentSlotName },
      }),
    };
  });
};

export class CustomDataClient extends DefaultDataClient {
  protected override async enhanceRoute(
    options: EnhanceRouteOptions
  ): Promise<void> {
    // The middleware only needs the route for personalization/test evaluation;
    // the page fetches the composition again (source: "pageState") and that's
    // the tree that actually gets rendered, so enhance only there.
    if (options.source === "middleware") return;

    addParentParameters(
      options.route.compositionApiResponse.composition as ComponentInstance
    );
  }
}

export const dataClient = new CustomDataClient();
