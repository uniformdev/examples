<script lang="ts">
  import type { Product } from "$lib/data/products";
  import { formatPrice } from "$lib/data/products";

  interface Props {
    eyebrow: string;
    headline: string;
    featuredBadge: string;
    learnMoreText: string;
    featuredProduct: Product;
    gridProducts: Product[];
  }

  let {
    eyebrow,
    headline,
    featuredBadge,
    learnMoreText,
    featuredProduct,
    gridProducts
  }: Props = $props();
</script>

<!-- Product Spotlights - Bento Grid -->
<section class="py-24 md:py-32">
  <div class="max-w-6xl mx-auto px-6">
    <!-- Section header -->
    <div class="text-center mb-16">
      <p class="text-sm font-medium text-accent uppercase tracking-widest mb-4">{eyebrow}</p>
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
        {headline}
      </h2>
    </div>
    
    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <!-- Featured large card -->
      <a href="/products/{featuredProduct.categorySlug}/{featuredProduct.id}" class="group md:row-span-2 relative rounded-3xl overflow-hidden bg-secondary">
        <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="p-8 md:p-10 h-full flex flex-col">
          <div class="mb-4">
            <p class="text-accent font-medium mb-1">{featuredBadge}</p>
            <h3 class="text-2xl md:text-3xl font-semibold">{featuredProduct.name}</h3>
            <p class="text-muted-foreground mt-2">{featuredProduct.tagline}</p>
          </div>
          <div class="flex-1 flex items-center justify-center py-8">
            <img 
              src={featuredProduct.image} 
              alt={featuredProduct.name}
              class="w-full max-w-sm h-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">{formatPrice(featuredProduct.price)}</span>
            <span class="inline-flex items-center gap-1 text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {learnMoreText}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </a>
      
      <!-- Smaller cards -->
      {#each gridProducts as product}
        <a href="/products/{product.categorySlug}/{product.id}" class="group relative rounded-3xl overflow-hidden bg-secondary">
          <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="p-6 md:p-8 flex flex-col h-full min-h-[320px]">
            <div class="mb-4">
              <h3 class="text-xl md:text-2xl font-semibold">{product.name}</h3>
              <p class="text-muted-foreground mt-1 text-sm">{product.tagline}</p>
            </div>
            <div class="flex-1 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                class="w-full max-w-[200px] h-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="font-medium">{formatPrice(product.price)}</span>
              <svg class="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
