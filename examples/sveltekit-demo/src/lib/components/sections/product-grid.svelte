<script lang="ts">
  import type { Product } from "$lib/data/products";
  import { formatPrice } from "$lib/data/products";

  interface Props {
    headline: string;
    subheadline: string;
    viewText: string;
    products: Product[];
  }

  let {
    headline,
    subheadline,
    viewText,
    products
  }: Props = $props();
</script>

<!-- All Products Quick View -->
<section class="py-24 md:py-32 bg-secondary/50">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">
          {headline}
        </h2>
        <p class="text-muted-foreground mt-2">{subheadline}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each products as product}
        <a 
          href="/products/{product.categorySlug}/{product.id}"
          class="group bg-background rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
        >
          <div class="aspect-square bg-secondary/50 p-8 flex items-center justify-center overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div class="p-6">
            <p class="text-xs font-medium text-accent uppercase tracking-wider">{product.category}</p>
            <h3 class="text-lg font-semibold mt-1">{product.name}</h3>
            <p class="text-sm text-muted-foreground mt-1 line-clamp-1">{product.tagline}</p>
            <div class="flex items-center justify-between mt-4">
              <span class="font-medium">{formatPrice(product.price)}</span>
              <span class="text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {viewText}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
