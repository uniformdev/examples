# Uniform React + Vite SSR — JSON Rules Engine personalization

A Vite + React SSR app that evaluates Uniform personalization variants using a custom selection algorithm backed by [`json-rules-engine`](https://github.com/CacheControl/json-rules-engine). Authors create the rules in the dashboard with the companion Mesh integration; this app runs the matching at request time against visitor facts stored as Uniform quirks.

## Companion Mesh integration (required)

This app is the runtime half. The authoring half lives in the companion Mesh integration:

- **[`mesh/json-engine-rule-personalization`](../../mesh/json-engine-rule-personalization)** — registers the `json-rules-engine` selection algorithm on the Uniform canvas and provides the rule editor + settings UI.

You need both apps for this to work end-to-end: the Mesh integration provides the authoring UI in the Uniform dashboard, and this app evaluates the saved rules in the visitor's browser.

## How it works

- `src/uniform/jsonRulesPlugin.ts` registers a `ContextPlugin` with a custom `PersonalizationSelectionAlgorithm` named `json-rules-engine`. The algorithm reads each variant's `pz.conditions` tree (authored by the Mesh integration) and walks it against the visitor's quirks using `json-rules-engine`'s operator registry.
- `src/uniform/factsLoader.ts` populates the visitor's facts as Uniform quirks. Each fact is stored as a top-level quirk so it also appears in the `ufvdqk` cookie and in the Context dev tools.
- A variant with no conditions is treated as a default — it always matches. Place it last in the variant list so it is selected only when no other variant's conditions are met.

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Uniform project ID and API key (Developer role).
3. Install and run the companion [Mesh integration](../../mesh/json-engine-rule-personalization). The runtime app cannot author rules — the dashboard editor lives there.
4. `npm run uniform:push` to push the bundled `uniform-data/` content into your project (or author your own).
5. `npm run dev` and open the URL the script prints.

## Production build

1. `npm run build`
2. `npm run start`

## Related links

- [`json-rules-engine` on GitHub](https://github.com/CacheControl/json-rules-engine) — the rule format and operators evaluated by this app.
- Companion authoring integration: [`mesh/json-engine-rule-personalization`](../../mesh/json-engine-rule-personalization).
- Base SSR starter without personalization: [`examples/react-vite-ssr`](../react-vite-ssr).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` with `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
