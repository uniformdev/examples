<script lang="ts">
  import type { Product } from "$lib/data/products";
  import { formatPrice } from "$lib/data/products";

  interface Props {
    product: Product;
    specsLimit: number;
    learnMoreText: string;
  }

  let {
    product,
    specsLimit,
    learnMoreText
  }: Props = $props();

  const displaySpecs = $derived(product.specs.slice(0, specsLimit));
</script>

<!-- Featured Product Deep Dive -->
<section class="py-24 md:py-32">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <!-- Product Image -->
      <div class="relative group order-2 lg:order-1">
        <div class="absolute -inset-8 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <img 
          src={product.image}
          alt={product.name}
          class="w-full h-auto animate-float"
        />
      </div>
      
      <!-- Product Info -->
      <div class="order-1 lg:order-2">
        <p class="text-accent font-medium mb-4">{product.category}</p>
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          {product.name}
        </h2>
        <p class="text-2xl text-muted-foreground mb-6">
          {product.tagline}
        </p>
        <p class="text-muted-foreground leading-relaxed mb-8">
          {product.description}
        </p>
        
        <!-- Key specs -->
        <div class="grid grid-cols-2 gap-4 mb-10">
          {#each displaySpecs as spec}
            <div class="p-4 rounded-xl bg-secondary">
              <p class="text-sm text-muted-foreground">{spec.label}</p>
              <p class="font-semibold mt-1">{spec.value}</p>
            </div>
          {/each}
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <a 
            href="/products/{product.categorySlug}/{product.id}"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
          >
            {learnMoreText}
          </a>
          <span class="inline-flex items-center justify-center px-8 py-4 text-xl font-semibold">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
