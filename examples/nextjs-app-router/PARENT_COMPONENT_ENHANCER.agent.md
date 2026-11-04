# Agent instructions: add parent component info to Uniform child components

Goal: every non-root component in a Uniform composition gets `{ id, type, name }` describing its nearest non-system parent, readable in the component's code. This lets components use their container's name for analytics, context-dependent styling, or debugging personalization and A/B test variations.

## 1. Identify the SDK

Check `package.json`:

- `@uniformdev/next-app-router` (v2, App Router): follow section 2.
- Anything else (`@uniformdev/canvas-next`, `@uniformdev/canvas-react`, Nuxt, etc.): follow section 3.

## 2. Next.js App Router

1. Make `@uniformdev/canvas` a direct dependency, at the same version as the installed `@uniformdev/next-app-router`. Confirm with `npm ls @uniformdev/canvas` that only one version is installed.
2. Create `lib/uniform/dataClient.ts`. Rules:
   - Override `enhanceRoute` on a subclass of `DefaultDataClient`, and return immediately if `options.source === "middleware"`.
   - Walk the composition with `walkNodeTree`. On non-`component` nodes, call `actions.stopProcessingDescendants()`.
   - Parent = first entry in `ancestorsAndSelf.slice(1)` whose `type` does not start with `$`.
   - Name = the parent's `$internal_displayName` parameter (`CANVAS_COMPONENT_DISPLAY_NAME_PARAM`) if it's a non-empty string, else `parent.type`.
   - Write it as a `parentComponent` parameter of type `json`.

   ```ts
   import { DefaultDataClient, type EnhanceRouteOptions } from "@uniformdev/next-app-router";
   import type { ComponentParameter } from "@uniformdev/next-app-router/component";
   import {
     CANVAS_COMPONENT_DISPLAY_NAME_PARAM,
     walkNodeTree,
     type ComponentInstance,
   } from "@uniformdev/canvas";

   export type ParentComponentData = { id: string | undefined; type: string; name: string };
   export type WithParentComponent = { parentComponent?: ComponentParameter<ParentComponentData> };

   const getName = (c: ComponentInstance) => {
     const displayName = c.parameters?.[CANVAS_COMPONENT_DISPLAY_NAME_PARAM]?.value;
     return typeof displayName === "string" && displayName ? displayName : c.type;
   };

   export class CustomDataClient extends DefaultDataClient {
     protected override async enhanceRoute(options: EnhanceRouteOptions): Promise<void> {
       if (options.source === "middleware") return;

       const composition = options.route.compositionApiResponse.composition as ComponentInstance;
       walkNodeTree(composition, ({ type, node, ancestorsAndSelf, actions }) => {
         if (type !== "component") return actions.stopProcessingDescendants();

         const parent = ancestorsAndSelf
           .slice(1)
           .map((a) => a.node as ComponentInstance)
           .find((a) => a && !a.type.startsWith("$"));
         if (!parent) return;

         const value: ParentComponentData = { id: parent._id, type: parent.type, name: getName(parent) };
         node.parameters = { ...node.parameters, parentComponent: { type: "json", value } };
       });
     }
   }

   export const dataClient = new CustomDataClient();
   ```

3. In `app/uniform/[code]/page.tsx`, add `dataClient={dataClient}` to `<UniformComposition>`. If the project already passes a custom data client, add the override to that class instead of creating a second one.
4. In components that need it, add `WithParentComponent` to the props type and read `parameters.parentComponent?.value`.

Do not:

- Use `EnhancerBuilder().data(...)`. The App Router SDK doesn't pass `component.data` to components.
- Read the parent from the `component` prop. It only has `_id`, `_parentId`, `slotName` and `slotIndex`, and `_parentId` can point at a `$personalization` or `$test` wrapper.
- Decode or re-encode the `[code]` route segment.

## 3. Other SDKs

Look at the props the SDK passes to components:

- Full component instance (with `data`): in the SDK's enhancement step, build a child → parent index with `walkNodeTree` (use the same parent and name rules as above), then call `enhance({ composition, enhancers: new EnhancerBuilder().data("parent", ({ component }) => index.get(component)), context: {} })`. `enhance` passes the same node objects to enhancers, so a `WeakMap` keyed by node works. Components read `component.data.parent`.
- Parameters only: use the parameter approach from section 2, in whatever enhancement step the SDK offers.

## 4. Verify

1. Run `npx tsc --noEmit`.
2. Unit-check the walk against a mock composition: one `section` containing a `$personalization` with several variations and a `$test` with a nested `$personalization`. Every variation must report the `section` as its parent, and the root must have no parent.
3. Temporarily render `parameters.parentComponent?.value?.name` as text in one or more components, start the dev server and load a page that has personalization or a test.

Report anything you couldn't verify, such as the dev server being unable to start.
