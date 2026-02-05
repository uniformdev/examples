<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from "$lib/components/ui/button";
  import { 
    categories, 
    products, 
    getCategoryBySlug, 
    getProductsByCategory,
    formatPrice 
  } from "$lib/data/products";

  let categorySlug = $derived($page.params.category);
  let category = $derived(getCategoryBySlug(categorySlug));
  let categoryProducts = $derived(getProductsByCategory(categorySlug));
  
  let sortBy = $state<'price-asc' | 'price-desc' | 'name'>('name');
  
  let sortedProducts = $derived.by(() => {
    const sorted = [...categoryProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  });
</script>

<svelte:head>
  <title>{category?.name || 'Products'} | Cherry</title>
  <meta name="description" content={category?.description || 'Browse our range of precision manufacturing equipment.'} />
</svelte:head>

<div class="pt-20 lg:pt-24">
  <!-- Breadcrumb -->
  <div class="max-w-7xl mx-auto px-6 lg:px-8 py-4">
    <nav class="flex items-center gap-2 text-sm text-muted-foreground">
      <a href="/" class="hover:text-foreground transition-colors">Home</a>
      <span>/</span>
      <a href="/" class="hover:text-foreground transition-colors">Products</a>
      <span>/</span>
      <span class="text-foreground">{category?.name || 'Category'}</span>
    </nav>
  </div>

  <!-- Hero -->
  <section class="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-16">
    <div class="max-w-3xl">
      <h1 class="text-4xl lg:text-6xl font-bold tracking-tight">
        {category?.name || 'Products'}
      </h1>
      <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
        {category?.description || 'Browse our range of precision manufacturing equipment.'}
      </p>
    </div>
  </section>

  <!-- Filter Bar -->
  <section class="border-y border-border bg-card">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <!-- Category Tabs -->
        <div class="flex flex-wrap items-center gap-2">
          {#each categories as cat}
            <a 
              href="/products/{cat.slug}"
              class="px-4 py-2 text-sm font-medium rounded-full transition-colors {cat.slug === categorySlug ? 'bg-foreground text-background' : 'bg-secondary hover:bg-secondary/80'}"
            >
              {cat.name}
            </a>
          {/each}
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted-foreground">Sort by:</span>
          <select 
            bind:value={sortBy}
            class="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <!-- Products Grid -->
  <section class="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <div class="flex items-center justify-between mb-8">
      <p class="text-sm text-muted-foreground">
        Showing <span class="font-medium text-foreground">{categoryProducts.length}</span> products
      </p>
    </div>

    {#if categoryProducts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {#each sortedProducts as product}
          <a href="/products/{product.categorySlug}/{product.id}" class="group">
            <div class="bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute top-4 right-4">
                  <div class="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="font-semibold text-lg group-hover:text-accent transition-colors">{product.name}</h3>
                    <span class="inline-block mt-2 px-2 py-1 text-xs font-medium bg-secondary rounded">
                      {product.category}
                    </span>
                  </div>
                  <svg class="w-5 h-5 mt-1 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p class="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescription}
                </p>
                <div class="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p class="font-semibold text-accent">
                    From {formatPrice(product.price)}
                  </p>
                  <span class="text-xs text-muted-foreground uppercase tracking-wider">
                    View Specs
                  </span>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center py-20">
        <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">No products found</h3>
        <p class="text-muted-foreground mb-6">This category doesn't have any products yet.</p>
        <Button href="/" variant="outline">Browse All Products</Button>
      </div>
    {/if}
  </section>

  <!-- CTA -->
  <section class="bg-card border-t border-border">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div>
          <h2 class="text-2xl lg:text-3xl font-bold tracking-tight">
            Need help choosing the right machine?
          </h2>
          <p class="mt-2 text-muted-foreground">
            Our specialists can guide you to the perfect solution for your needs.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <Button size="lg" class="bg-foreground text-background hover:bg-foreground/90 px-8">
            Contact Sales
          </Button>
          <Button size="lg" variant="outline" class="px-8 border-foreground/30">
            Download Catalog
          </Button>
        </div>
      </div>
    </div>
  </section>
</div>
