# Agent instructions: add the parent slot name to Uniform child components

Goal: every non-root component in a Uniform composition gets a `parentSlotName` parameter holding the name of the slot it sits in on its nearest non-system parent, readable in the component's code. This lets a component render differently depending on where an author placed it (e.g. `sidebar` vs `content`), and keeps working when the component is wrapped in a personalization, A/B test or slot section.

Why not use the `component.slotName` prop the SDK already passes: it is the slot of the *immediate* parent, which for a personalization variation is `pz`, for an A/B test variant `test`, and inside a slot section `$slotSectionItems`. `parentSlotName` skips those system wrappers and reports the slot on the real parent.

This guide targets Next.js App Router projects using `@uniformdev/next-app-router` (v2). Check `package.json` before you start.

## 1. Dependencies

Make `@uniformdev/canvas` a direct dependency, at the same version as the installed `@uniformdev/next-app-router`. Confirm with `npm ls @uniformdev/canvas` that only one version is installed.

## 2. Data client

Create `lib/uniform/dataClient.ts` (`src/lib/uniform/dataClient.ts` if the project uses a `src/` dir; match the project's import alias and quote style). If the project already has a custom data client (e.g. one adding `parentComponent`), add the slot logic to the existing walk in that class instead of creating a second client or a second walk.

Rules:

- Override `enhanceRoute` on a subclass of `DefaultDataClient`, and return immediately if `options.source === "middleware"`.
- Walk the composition with `walkNodeTree`. On non-`component` nodes, call `actions.stopProcessingDescendants()`.
- Parent index `p` = first index `> 0` in `ancestorsAndSelf` whose `node.type` does not start with `$`.
- Slot name = `ancestorsAndSelf[p - 1].parentSlot`. `ancestorsAndSelf[i].parentSlot` is the slot on `ancestorsAndSelf[i + 1]` that contains `ancestorsAndSelf[i]`, so entry `p - 1` (the node itself, or the outermost system wrapper around it) holds the slot on the real parent. Only read it when that entry's `type === "slot"`.
- Write it as a `parentSlotName` parameter of type `text`.

```ts
import { DefaultDataClient, type EnhanceRouteOptions } from "@uniformdev/next-app-router";
import type { ComponentParameter } from "@uniformdev/next-app-router/component";
import { walkNodeTree, type ComponentInstance } from "@uniformdev/canvas";

export const PARENT_SLOT_PARAMETER_ID = "parentSlotName";

export type WithParentSlotName = { parentSlotName?: ComponentParameter<string> };

export class CustomDataClient extends DefaultDataClient {
  protected override async enhanceRoute(options: EnhanceRouteOptions): Promise<void> {
    if (options.source === "middleware") return;

    const composition = options.route.compositionApiResponse.composition as ComponentInstance;
    walkNodeTree(composition, ({ type, node, ancestorsAndSelf, actions }) => {
      if (type !== "component") return actions.stopProcessingDescendants();

      // [0] is the node itself, [1] its parent, and so on. Skip $personalization, $test, $slotSection, ...
      const parentIndex = ancestorsAndSelf.findIndex(
        (a, i) => i > 0 && !(a.node as ComponentInstance).type.startsWith("$")
      );
      if (parentIndex < 1) return;

      const location = ancestorsAndSelf[parentIndex - 1];
      if (location.type !== "slot") return;

      node.parameters = {
        ...node.parameters,
        [PARENT_SLOT_PARAMETER_ID]: { type: "text", value: location.parentSlot },
      };
    });
  }
}

export const dataClient = new CustomDataClient();
```

## 3. Wire it up

1. In `app/uniform/[code]/page.tsx`, add `dataClient={dataClient}` to `<UniformComposition>` (skip if it is already passed).
2. In components that need it, intersect `WithParentSlotName` into the **`parameters`** prop (it describes parameters, not top-level props), e.g. `type Props = ComponentProps<MyParams> & { parameters: WithParentSlotName }`, then read `parameters.parentSlotName?.value`. If the project wraps components in a parameter-flattening HOC, `parentSlotName` may also arrive as a flattened top-level prop; still read it from `parameters` so the type stays accurate.

Do not:

- Use `EnhancerBuilder().data(...)`. The App Router SDK doesn't pass `component.data` to components.
- Use `component.slotName` or `component._parentId` from the `component` prop as a substitute. They describe the immediate parent, which can be a `$personalization`, `$test` or `$slotSection` wrapper.
- Decode or re-encode the `[code]` route segment.

## 4. Verify

1. Run `npx tsc --noEmit`. If the project already has type errors, compare the error count with and without your changes and confirm none are in the new or edited files.
2. Unit-check the walk against a mock composition: a `page` with a `content` slot holding a `section`, whose `items` slot holds a `$personalization` with several variations and a `$test` whose variants include a nested `$personalization`; plus a `footer` slot holding a `$slotSection` with a child. Expected: `section` → `content`; every variation and both wrappers → `items`; the slot section's child → `footer`; the root has no `parentSlotName`. `enhanceRoute` is protected: cast the client to call it, and pass only `{ source: "pageState", route: { compositionApiResponse: { composition } } }`. Under Jest, `jest.mock("@uniformdev/next-app-router", () => ({ DefaultDataClient: class {} }))` avoids loading the SDK's server runtime. Also assert that `source: "middleware"` leaves the tree untouched. If the project has no unit test runner, use a throwaway script run with `node --experimental-strip-types` (Node 22+, use explicit `.mts` import paths) from inside the app dir so `@uniformdev/canvas` resolves, then delete it.
3. Temporarily render `parameters.parentSlotName?.value` as text in one or more components, start the dev server and load a page that has personalization or a test. Confirm variations show the real parent's slot name, not `pz` or `test`.

Report anything you couldn't verify, such as the dev server being unable to start.
