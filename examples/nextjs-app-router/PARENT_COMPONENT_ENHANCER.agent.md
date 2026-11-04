# Agent instructions: add parent component info to Uniform child components

Goal: every non-root component in a Uniform composition gets `{ id, type, name }` describing its nearest non-system parent, readable in the component's code. This lets components use their container's name for analytics, context-dependent styling, or debugging personalization and A/B test variations.

## 1. Identify the SDK

Check `package.json`:

- `@uniformdev/next-app-router` (v2, App Router): follow section 2.
- Anything else (`@uniformdev/canvas-next`, `@uniformdev/canvas-react`, Nuxt, etc.): follow section 3.

## 2. Next.js App Router

1. Make `@uniformdev/canvas` a direct dependency, at the same version as the installed `@uniformdev/next-app-router`. Confirm with `npm ls @uniformdev/canvas` that only one version is installed.
2. Create `lib/uniform/dataClient.ts` (`src/lib/uniform/dataClient.ts` if the project uses a `src/` dir; match the project's import alias and quote style). Rules:
   - Override `enhanceRoute` on a subclass of `DefaultDataClient`, and return immediately if `options.source === "middleware"`.
   - Walk the composition with `walkNodeTree`. On non-`component` nodes, call `actions.stopProcessingDescendants()`.
   - Parent = first entry in `ancestorsAndSelf.slice(1)` whose `type` does not start with `$`.
   - Name = the parent's `$internal_displayName` parameter (`CANVAS_COMPONENT_DISPLAY_NAME_PARAM`) if it's a non-empty string, else `parent.type`.
   - Write it as a `parentComponent` parameter of type `json`.
   - Use `parent._id ?? null` for the id: `_id` can be missing (e.g. components inside patterns), and Pages Router `getStaticProps`/`getServerSideProps` can't serialize `undefined`.

   ```ts
   import { DefaultDataClient, type EnhanceRouteOptions } from "@uniformdev/next-app-router";
   import type { ComponentParameter } from "@uniformdev/next-app-router/component";
   import {
     CANVAS_COMPONENT_DISPLAY_NAME_PARAM,
     walkNodeTree,
     type ComponentInstance,
   } from "@uniformdev/canvas";

   export type ParentComponentData = { id: string | null; type: string; name: string };
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

         const value: ParentComponentData = { id: parent._id ?? null, type: parent.type, name: getName(parent) };
         node.parameters = { ...node.parameters, parentComponent: { type: "json", value } };
       });
     }
   }

   export const dataClient = new CustomDataClient();
   ```

3. In `app/uniform/[code]/page.tsx`, add `dataClient={dataClient}` to `<UniformComposition>`. If the project already passes a custom data client, add the override to that class instead of creating a second one.
4. In components that need it, intersect `WithParentComponent` into the **`parameters`** prop (it describes parameters, not top-level props), e.g. `type Props = ComponentProps<MyParams> & { parameters: WithParentComponent }`, then read `parameters.parentComponent?.value`. If the project wraps components in a parameter-flattening HOC, `parentComponent` may also arrive as a flattened top-level prop; still read it from `parameters` so the type stays accurate.

Do not:

- Use `EnhancerBuilder().data(...)`. The App Router SDK doesn't pass `component.data` to components.
- Read the parent from the `component` prop. It only has `_id`, `_parentId`, `slotName` and `slotIndex`, and `_parentId` can point at a `$personalization` or `$test` wrapper.
- Decode or re-encode the `[code]` route segment.

## 3. Other SDKs

Look at the props the SDK passes to components:

- Full component instance (with `data`): in the SDK's enhancement step, build a child → parent index with `walkNodeTree` (use the same parent and name rules as above), then call `enhance({ composition, enhancers: new EnhancerBuilder().data("parent", ({ component }) => index.get(component)), context: {} })`. `enhance` passes the same node objects to enhancers, so a `WeakMap` keyed by node works. `enhance` resets `component.data` on every enhanced node, so if the project already calls `enhance`, add the `parent` enhancer to that existing `EnhancerBuilder` instead of calling `enhance` twice. Components read `component.data.parent`.
- Parameters only: use the parameter approach from section 2, in whatever enhancement step the SDK offers.

The Route API and Canvas API leave out component `_id`s unless the request passes `withComponentIDs: true`. Add it to the project's fetch options (e.g. `requestOptions` of the route handler), otherwise every parent `id` is `null` while `name` and `type` still look correct.

### Next.js Pages Router (`@uniformdev/canvas-next` + `@uniformdev/canvas-react`)

`canvas-react` passes the full instance, so use the `data` approach. The enhancement step is the `handleComposition` option of `withUniformGetStaticProps` / `withUniformGetServerSideProps` (in `pages/[[...slug]].tsx` or similar):

```ts
handleComposition: async (routeResponse, _context, defaultHandler) => {
  await addParentComponentData(routeResponse.compositionApiResponse.composition);
  return defaultHandler(routeResponse);
},
```

Add `withComponentIDs: true` to the handler's `requestOptions` (see above).

In components, `ComponentProps<T>['component']` is `ComponentInstance | RootComponentInstance` and the root type has no `data`, so narrow first: `const parent = "data" in component ? (component.data as { parent?: ParentComponentData } | undefined)?.parent : undefined;`.

## 4. Verify

1. Run `npx tsc --noEmit`. If the project already has type errors, compare the error count with and without your changes and confirm none are in the new or edited files.
2. Unit-check the walk against a mock composition: one `section` containing a `$personalization` with several variations and a `$test` with a nested `$personalization`. Every variation must report the `section` as its parent, and the root must have no parent. `enhanceRoute` is protected: cast the client to call it, and pass only `{ source: "pageState", route: { compositionApiResponse: { composition } } }`. Under Jest, `jest.mock("@uniformdev/next-app-router", () => ({ DefaultDataClient: class {} }))` avoids loading the SDK's server runtime. Also assert that `source: "middleware"` leaves the tree untouched (App Router only). If the project has no unit test runner, use a throwaway script run with `node --experimental-strip-types` (Node 22+, use explicit `.mts` import paths) from inside the app dir so `@uniformdev/canvas` resolves, then delete it.
3. Temporarily render the parent's `name` and `id` as text in one or more components (`parameters.parentComponent?.value` in section 2, `component.data.parent` in section 3), start the dev server and load a page that has personalization or a test. Confirm the `id` is not empty; if it is, the fetch is missing `withComponentIDs: true`.

Report anything you couldn't verify, such as the dev server being unable to start.
