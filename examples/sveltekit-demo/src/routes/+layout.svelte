<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import { dev } from "$app/environment";
  import {
    PUBLIC_UNIFORM_INSIGHTS_API_KEY,
    PUBLIC_UNIFORM_INSIGHTS_PROJECT_ID,
  } from "$env/static/public";
  import {
    Context,
    CookieTransitionDataStore,
    enableContextDevTools,
    enableDebugConsoleLogDrain,
  } from "@uniformdev/context";
  import { UniformContext } from "@uniformdev/context-svelte";
  import type { ManifestV2 } from "@uniformdev/context";
  import { enableUniformInsights } from "@uniformdev/insights";

  import manifestJson from "$lib/uniform/contextManifest.json";

  let { children } = $props();

  const context = new Context({
    defaultConsent: true,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: undefined,
    }),
    plugins: [
      enableContextDevTools(),
      enableDebugConsoleLogDrain("debug"),
      enableUniformInsights({
        endpoint: {
          type: "api",
          projectId: PUBLIC_UNIFORM_INSIGHTS_PROJECT_ID,
          apiKey: PUBLIC_UNIFORM_INSIGHTS_API_KEY,
          host: "https://analytics.uniform.global",
        },
      }),
    ],
    manifest: manifestJson as ManifestV2,
  });

  // Only use dark hero mode on homepage
  const isHomepage = $derived($page.url.pathname === "/");
</script>

<UniformContext {context} outputType={dev ? "standard" : "edge"}>
  <div class="min-h-screen flex flex-col">
    <Header darkHero={isHomepage} />
    <main class="flex-1">
      {@render children()}
    </main>
    <Footer />
  </div>
</UniformContext>
