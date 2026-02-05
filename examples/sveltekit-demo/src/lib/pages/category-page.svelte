<script lang="ts">
  import { 
    categories, 
    getProductsByCategory, 
    getCategoryBySlug, 
    formatPrice 
  } from "$lib/data/products";

  let { category } = $props<{ category: string }>();

  const currentCategory = $derived(getCategoryBySlug(category));
  const categoryProducts = $derived(getProductsByCategory(category));
  
  let sortBy = $state<"name" | "price-low" | "price-high">("name");
  
  const sortedProducts = $derived.by(() => {
    const prods = [...categoryProducts];
    switch (sortBy) {
      case "price-low":
        return prods.sort((a, b) => a.price - b.price);
      case "price-high":
        return prods.sort((a, b) => b.price - a.price);
      default:
        return prods.sort((a, b) => a.name.localeCompare(b.name));
    }
  });
</script>

<svelte:head>
  <title>{currentCategory?.name || "Products"} | Cherry</title>
</svelte:head>

<!-- Hero -->
<section class="pt-20 pb-16 md:pt-28 md:pb-20">
  <div class="max-w-6xl mx-auto px-6 text-center">
    <p class="text-accent font-medium mb-4 animate-fade-up" style="opacity: 0;">{currentCategory?.tagline || "Explore our products"}</p>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight animate-fade-up delay-100" style="opacity: 0;">
      {currentCategory?.name || "All Products"}
    </h1>
    {#if currentCategory}
      <p class="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-200" style="opacity: 0;">
        {currentCategory.description}
      </p>
    {/if}
  </div>
</section>

<!-- Category Tabs -->
<section class="border-b border-border bg-background sticky top-14 z-40">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex items-center justify-center gap-2 py-4 overflow-x-auto">
      {#each categories as cat}
        <a 
          href="/products/{cat.slug}"
          class="px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 {cat.slug === category ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}"
        >
          {cat.name}
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Sort & Count -->
<section class="py-6">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
      </p>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Sort:</span>
        <select 
          bind:value={sortBy}
          class="text-sm bg-transparent border-0 font-medium focus:outline-none cursor-pointer"
        >
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  </div>
</section>

<!-- Product Grid -->
<section class="pb-20 md:pb-28">
  <div class="max-w-6xl mx-auto px-6">
    {#if sortedProducts.length === 0}
      <div class="text-center py-20">
        <p class="text-muted-foreground mb-4">No products found in this category.</p>
        <a 
          href="/products/neural"
          class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
        >
          Browse Neural
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {#each sortedProducts as product, i}
          <a 
            href="/products/{product.categorySlug}/{product.id}" 
            class="group relative bg-secondary rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
          >
            <!-- Hover glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="p-8 md:p-10">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <p class="text-sm text-accent font-medium mb-1">{product.color || 'New'}</p>
                  <h3 class="text-2xl md:text-3xl font-semibold">{product.name}</h3>
                </div>
                <div class="w-10 h-10 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              <p class="text-muted-foreground mb-6">{product.tagline}</p>
              
              <!-- Product Image -->
              <div class="aspect-[4/3] flex items-center justify-center py-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  class="w-full h-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2"
                />
              </div>
              
              <!-- Bottom info -->
              <div class="flex items-center justify-between pt-6 border-t border-border/50">
                <span class="text-lg font-semibold">{formatPrice(product.price)}</span>
                <span class="text-sm text-muted-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                  Learn more
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Other Categories -->
<section class="py-16 md:py-20 bg-secondary/50">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-2xl md:text-3xl font-semibold text-center mb-10">
      Explore other categories
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each categories.filter(c => c.slug !== category) as otherCategory}
        <a 
          href="/products/{otherCategory.slug}"
          class="group p-6 bg-background rounded-2xl text-center hover:shadow-lg transition-all duration-300"
        >
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            {#if otherCategory.slug === 'neural'}
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            {:else if otherCategory.slug === 'vision'}
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            {:else}
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            {/if}
          </div>
          <h3 class="text-lg font-semibold mb-1">{otherCategory.name}</h3>
          <p class="text-sm text-muted-foreground">{otherCategory.tagline}</p>
        </a>
      {/each}
    </div>
  </div>
</section>
