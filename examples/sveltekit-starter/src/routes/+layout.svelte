<script lang="ts">
  import { dev } from "$app/environment";
  import favicon from "$lib/assets/favicon.svg";
  import { Context, CookieTransitionDataStore, enableContextDevTools, enableDebugConsoleLogDrain } from "@uniformdev/context";
  import { UniformContext } from "@uniformdev/context-svelte";
  import type { ManifestV2 } from "@uniformdev/context";
  import manifestJson from "$lib/uniform/contextManifest.json";

  let { children } = $props();

  const context = new Context({
    defaultConsent: true,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: undefined,
    }),
    plugins: [enableContextDevTools(), enableDebugConsoleLogDrain("debug")],
    manifest: manifestJson as ManifestV2,
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<UniformContext {context} outputType={dev ? "standard" : "edge"}>
  {@render children()}
</UniformContext>
