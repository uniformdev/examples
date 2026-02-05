<script lang="ts">
  import { 
    getProductById, 
    getProductsByCategory, 
    getCategoryBySlug,
    formatPrice 
  } from "$lib/data/products";

  let { category, productId } = $props<{ category: string; productId: string }>();

  const product = $derived(getProductById(productId));
  const currentCategory = $derived(getCategoryBySlug(category));
  const relatedProducts = $derived(
    getProductsByCategory(category).filter(p => p.id !== productId).slice(0, 2)
  );
  
  let activeTab = $state<"specs" | "features">("specs");
  let showImageModal = $state(false);
</script>

<svelte:head>
  <title>{product?.name || "Product"} | Cherry</title>
</svelte:head>

{#if !product}
  <section class="pt-28 pb-20 lg:pt-36">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h1 class="text-3xl font-semibold mb-4">Product Not Found</h1>
      <p class="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
      <a 
        href="/products/neural"
        class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
      >
        Browse Products
      </a>
    </div>
  </section>
{:else}
  <!-- Product Hero -->
  <section class="pt-20 md:pt-28 pb-16 md:pb-24">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" class="hover:text-foreground transition-colors">Home</a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <a href="/products/{category}" class="hover:text-foreground transition-colors">
          {currentCategory?.name || "Products"}
        </a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-foreground">{product.name}</span>
      </nav>

      <!-- Hero Content -->
      <div class="text-center mb-12">
        <p class="text-accent font-medium mb-3">{product.tagline}</p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
          {product.name}
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {product.shortDescription}
        </p>
        <p class="mt-6 text-2xl font-semibold">
          From {formatPrice(product.price)}
        </p>
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button class="px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors">
            Pre-order now
          </button>
          <button class="px-8 py-4 text-accent font-medium hover:text-accent/80 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Watch the film
          </button>
        </div>
      </div>

      <!-- Product Image -->
      <button 
        class="relative w-full max-w-4xl mx-auto group cursor-zoom-in"
        onclick={() => showImageModal = true}
      >
        <div class="absolute -inset-8 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative bg-secondary rounded-3xl p-8 md:p-12 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            class="w-full h-auto max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-medium">
              Click to enlarge
            </span>
          </div>
        </div>
      </button>
    </div>
  </section>

  <!-- Key Specs Banner -->
  <section class="py-12 bg-foreground text-primary-foreground">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each product.specs.slice(0, 4) as spec}
          <div class="text-center">
            <p class="text-2xl md:text-3xl font-semibold text-accent">{spec.value}</p>
            <p class="text-sm text-primary-foreground/60 mt-1">{spec.label}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Description & Features -->
  <section class="py-20 md:py-28">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Description -->
        <div>
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            Designed for the future you.
          </h2>
          <p class="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          {#if product.color}
            <div class="mt-8 flex items-center gap-3">
              <span class="text-sm text-muted-foreground">Finish:</span>
              <span class="px-3 py-1 bg-secondary rounded-full text-sm font-medium">{product.color}</span>
            </div>
          {/if}
        </div>
        
        <!-- Features List -->
        <div>
          <h3 class="text-xl font-semibold mb-6">Key Features</h3>
          <div class="space-y-4">
            {#each product.features as feature}
              <div class="flex items-start gap-4 p-4 bg-secondary/50 rounded-2xl">
                <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="font-medium pt-1">{feature}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Full Specs -->
  <section class="py-20 md:py-28 bg-secondary/50">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-12">
        Technical Specifications
      </h2>
      <div class="max-w-3xl mx-auto">
        <div class="bg-background rounded-3xl divide-y divide-border">
          {#each product.specs as spec}
            <div class="flex items-center justify-between p-6">
              <span class="text-muted-foreground">{spec.label}</span>
              <span class="font-medium">{spec.value}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Related Products -->
  {#if relatedProducts.length > 0}
    <section class="py-20 md:py-28">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-4">
          Goes great with
        </h2>
        <p class="text-muted-foreground text-center mb-12">
          Complete your setup with these complementary devices.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each relatedProducts as relatedProduct}
            <a 
              href="/products/{relatedProduct.categorySlug}/{relatedProduct.id}" 
              class="group bg-secondary rounded-3xl p-8 transition-all duration-500 hover:shadow-xl"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-semibold">{relatedProduct.name}</h3>
                  <p class="text-muted-foreground mt-1">{relatedProduct.tagline}</p>
                </div>
                <span class="font-semibold">{formatPrice(relatedProduct.price)}</span>
              </div>
              <div class="aspect-video flex items-center justify-center">
                <img 
                  src={relatedProduct.image} 
                  alt={relatedProduct.name}
                  class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- CTA -->
  <section class="py-20 md:py-28 bg-foreground text-primary-foreground">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        Ready to experience {product.name}?
      </h2>
      <p class="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
        Pre-order now and be among the first to own the future.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-8 py-4 bg-background text-foreground rounded-full font-medium hover:bg-background/90 transition-colors">
          Pre-order for {formatPrice(product.price)}
        </button>
        <button class="px-8 py-4 border border-primary-foreground/30 rounded-full font-medium hover:bg-primary-foreground/10 transition-colors">
          Compare models
        </button>
      </div>
    </div>
  </section>

  <!-- Image Modal -->
  {#if showImageModal}
    <div 
      class="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button 
        class="absolute top-6 right-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
        onclick={() => showImageModal = false}
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button
        class="max-w-5xl w-full cursor-zoom-out"
        onclick={() => showImageModal = false}
      >
        <img 
          src={product.image} 
          alt={product.name}
          class="w-full h-auto max-h-[85vh] object-contain"
        />
      </button>
    </div>
  {/if}
{/if}
