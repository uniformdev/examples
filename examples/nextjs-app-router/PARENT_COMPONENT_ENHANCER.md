# Adding parent component info to child components

## Why

A Uniform component only knows about itself. Sometimes it needs to know where it sits:

- Analytics and tracking: tag clicks and impressions with the section they came from ("CTA clicked in *Spring Promo Hero*").
- Styling by context: render a card differently inside a carousel than inside a grid.
- Debugging and QA: see at a glance which container a personalization or A/B test variation belongs to.

The name comes from the parent's display name in Canvas, so authors don't need to set anything up.

## How it works (any Uniform SDK)

Before rendering, the composition is a JSON tree. You can change it after it's fetched and before it's rendered. That step is called **enhancing** (see [Enhancers](https://docs.uniform.app/docs/guides/composition/enhancers)).

To add parent info:

1. Walk the composition tree (`walkNodeTree` from `@uniformdev/canvas`). For each component, `ancestorsAndSelf[1]` is its parent.
2. Skip system components whose type starts with `$` (`$personalization`, `$test`, `$slotSection`). Every personalization or test variation then points at the real component that contains it, not at the wrapper.
3. Write `{ id, type, name }` onto the child. Use the parent's `$internal_displayName` parameter as `name`, and fall back to its `type`. Use `null` when the parent has no `_id` (components inside patterns, for example), because some frameworks can't serialize `undefined`.

Where you write it depends on what your SDK passes to components:

- If components receive the full component instance, the classic `enhance()` + `EnhancerBuilder().data("parent", ...)` works, and components read `component.data.parent`. `enhance()` resets `component.data` on every node it enhances, so if the project already calls `enhance()`, add the `parent` enhancer to that existing builder rather than calling it twice.
- If components receive only parameters, write a parameter instead (for example `parentComponent`, type `json`).

Component `_id`s are only in the API response when the request passes `withComponentIDs: true`. Without it, every parent `id` is empty while `name` and `type` still look right.

## Next.js App Router (`@uniformdev/next-app-router`)

The App Router SDK passes every composition parameter to React components as `parameters.<id>`. It does not pass `component.data`, so a `.data()` enhancer has no effect here. Use a parameter.

The hook for enhancing is a custom data client:

1. Extend `DefaultDataClient` and override `enhanceRoute(options)`. It receives the fetched composition at `options.route.compositionApiResponse.composition`, and you change it in place.
2. Return early when `options.source === "middleware"`. The page fetches the composition again (`source: "pageState"`), and that copy is the one that renders.
3. Pass the client to `<UniformComposition dataClient={dataClient} />` in `app/uniform/[code]/page.tsx`.

The data client gets the full composition, so you don't need to decode the `[code]` page-state segment or re-encode anything.

The App Router SDK already requests component IDs on the page side, so no extra fetch option is needed.

Components then read it like any other parameter. Add the parent type to the component's parameters type:

```tsx
type ParentComponentData = { id: string | null; type: string; name: string };
type HeroParams = { title?: ComponentParameter<string> } & {
  parentComponent?: ComponentParameter<ParentComponentData>;
};

export const Hero = ({ parameters: { parentComponent } }: ComponentProps<HeroParams>) => (
  <p>Parent: {parentComponent?.value?.name}</p>
);
```

## Example data client

```ts
import { DefaultDataClient, type EnhanceRouteOptions } from "@uniformdev/next-app-router";
import { CANVAS_COMPONENT_DISPLAY_NAME_PARAM, walkNodeTree, type ComponentInstance } from "@uniformdev/canvas";

export class CustomDataClient extends DefaultDataClient {
  protected override async enhanceRoute(options: EnhanceRouteOptions) {
    if (options.source === "middleware") return;

    const composition = options.route.compositionApiResponse.composition as ComponentInstance;
    walkNodeTree(composition, ({ type, node, ancestorsAndSelf, actions }) => {
      if (type !== "component") return actions.stopProcessingDescendants();

      const parent = ancestorsAndSelf
        .slice(1)
        .map((a) => a.node as ComponentInstance)
        .find((a) => a && !a.type.startsWith("$"));
      if (!parent) return;

      const displayName = parent.parameters?.[CANVAS_COMPONENT_DISPLAY_NAME_PARAM]?.value;
      node.parameters = {
        ...node.parameters,
        parentComponent: {
          type: "json",
          value: {
            id: parent._id ?? null,
            type: parent.type,
            name: typeof displayName === "string" && displayName ? displayName : parent.type,
          },
        },
      };
    });
  }
}

export const dataClient = new CustomDataClient();
```

## Next.js Pages Router (`@uniformdev/canvas-next`)

`@uniformdev/canvas-react` passes the full component instance to components, so the classic `.data()` enhancer works. Run it in the `handleComposition` option of `withUniformGetStaticProps` or `withUniformGetServerSideProps`, before calling the default handler, and add `withComponentIDs: true` to the handler's `requestOptions`. In components, the `component` prop can also be the root composition, which has no `data`, so check for `data` before reading `component.data.parent`.

## Caveats

- If a component already has a parameter with the same ID, this overwrites it. Pick a unique ID.
- Routes that don't use this data client (such as the playground route) won't have the parameter.
- Add `@uniformdev/canvas` as a direct dependency, at the same version as your other `@uniformdev/*` packages, so only one copy is installed.
