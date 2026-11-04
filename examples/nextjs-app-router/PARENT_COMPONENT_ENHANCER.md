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
3. Write `{ id, type, name }` onto the child. Use the parent's `$internal_displayName` parameter as `name`, and fall back to its `type`.

Where you write it depends on what your SDK passes to components:

- If components receive the full component instance, the classic `enhance()` + `EnhancerBuilder().data("parent", ...)` works, and components read `component.data.parent`.
- If components receive only parameters, write a parameter instead (for example `parentComponent`, type `json`).

## Next.js App Router (`@uniformdev/next-app-router`)

The App Router SDK passes every composition parameter to React components as `parameters.<id>`. It does not pass `component.data`, so a `.data()` enhancer has no effect here. Use a parameter.

The hook for enhancing is a custom data client:

1. Extend `DefaultDataClient` and override `enhanceRoute(options)`. It receives the fetched composition at `options.route.compositionApiResponse.composition`, and you change it in place.
2. Return early when `options.source === "middleware"`. The page fetches the composition again (`source: "pageState"`), and that copy is the one that renders.
3. Pass the client to `<UniformComposition dataClient={dataClient} />` in `app/uniform/[code]/page.tsx`.

The data client gets the full composition, so you don't need to decode the `[code]` page-state segment or re-encode anything.

Components then read it like any other parameter:

```tsx
export const Hero = ({ parameters: { parentComponent } }: ComponentProps<HeroProps>) => (
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
            id: parent._id,
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

## Caveats

- If a component already has a parameter with the same ID, this overwrites it. Pick a unique ID.
- Routes that don't use this data client (such as the playground route) won't have the parameter.
- Add `@uniformdev/canvas` as a direct dependency, at the same version as your other `@uniformdev/*` packages, so only one copy is installed.
