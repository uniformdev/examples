<script lang="ts">
  import type { Category } from "$lib/data/products";

  interface Props {
    headline: string;
    exploreText: string;
    categories: Category[];
    categoryIcons: Record<string, string>;
  }

  let {
    headline,
    exploreText,
    categories,
    categoryIcons
  }: Props = $props();

  function getIconType(slug: string): string {
    return categoryIcons[slug] || 'wifi';
  }
</script>

<!-- Category Showcase - Full-width immersive cards -->
<section class="py-24 md:py-32 bg-foreground text-primary-foreground">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-semibold tracking-tight">
        {headline}
      </h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each categories as category}
        <a 
          href="/products/{category.slug}" 
          class="group relative rounded-2xl overflow-hidden bg-primary-foreground/5 border border-primary-foreground/10 hover:border-accent/50 transition-all duration-500"
        >
          <div class="p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              {#if getIconType(category.slug) === 'brain'}
                <svg class="w-10 h-10 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              {:else if getIconType(category.slug) === 'eye'}
                <svg class="w-10 h-10 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              {:else}
                <svg class="w-10 h-10 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
              {/if}
            </div>
            <h3 class="text-2xl font-semibold mb-2">{category.name}</h3>
            <p class="text-primary-foreground/60 text-sm mb-4">{category.tagline}</p>
            <span class="inline-flex items-center gap-2 text-sm text-accent font-medium">
              {exploreText}
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
