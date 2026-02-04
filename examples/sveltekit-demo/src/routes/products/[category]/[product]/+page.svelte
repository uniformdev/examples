<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from "$lib/components/ui/button";
  import { 
    getProductById, 
    getCategoryBySlug,
    getProductsByCategory,
    formatPrice,
    type Product
  } from "$lib/data/products";

  let productId = $derived($page.params.product);
  let categorySlug = $derived($page.params.category);
  
  let product = $derived(getProductById(productId));
  let category = $derived(getCategoryBySlug(categorySlug));
  let relatedProducts = $derived(
    getProductsByCategory(categorySlug).filter(p => p.id !== productId).slice(0, 2)
  );

  let activeTab = $state<'specs' | 'features'>('specs');
  let imageZoomed = $state(false);
</script>

<svelte:head>
  <title>{product?.name || 'Product'} | ForgeTech Industries</title>
  <meta name="description" content={product?.shortDescription || 'High-quality precision manufacturing equipment.'} />
</svelte:head>

{#if product}
  <div class="pt-20 lg:pt-24">
    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-4">
      <nav class="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground transition-colors">Home</a>
        <span>/</span>
        <a href="/products/{categorySlug}" class="hover:text-foreground transition-colors">{category?.name || 'Products'}</a>
        <span>/</span>
        <span class="text-foreground">{product.name}</span>
      </nav>
    </div>

    <!-- Product Hero -->
    <section class="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Product Image -->
        <div class="relative">
          <div 
            class="aspect-square bg-card rounded-lg overflow-hidden border border-border cursor-zoom-in"
            role="button"
            tabindex="0"
            onclick={() => imageZoomed = true}
            onkeydown={(e) => e.key === 'Enter' && (imageZoomed = true)}
          >
            <img 
              src={product.image} 
              alt={product.name}
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute bottom-4 left-4 flex gap-2">
            <span class="px-3 py-1.5 bg-background/90 backdrop-blur-sm text-sm font-medium rounded-full border border-border">
              {product.category}
            </span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <div class="flex-1">
            <span class="text-sm font-medium text-accent uppercase tracking-widest">
              {product.category}
            </span>
            <h1 class="mt-2 text-3xl lg:text-5xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
            
            <div class="mt-8 pb-8 border-b border-border">
              <div class="flex items-baseline gap-4">
                <span class="text-3xl font-bold text-accent">
                  {formatPrice(product.price)}
                </span>
                <span class="text-sm text-muted-foreground">Starting price</span>
              </div>
            </div>

            <div class="mt-8">
              <p class="text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" class="flex-1 bg-foreground text-background hover:bg-foreground/90">
              Request Quote
            </Button>
            <Button size="lg" variant="outline" class="flex-1 border-foreground/30">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Datasheet PDF
            </Button>
          </div>

          <div class="mt-6 p-4 bg-card rounded-lg border border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium">Speak with a specialist</p>
                <p class="text-sm text-muted-foreground">+1 (800) 555-1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs & Features Tabs -->
    <section class="bg-card border-y border-border">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Tab Headers -->
        <div class="flex gap-0 border-b border-border">
          <button 
            class="px-6 py-4 text-sm font-medium transition-colors relative {activeTab === 'specs' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}"
            onclick={() => activeTab = 'specs'}
          >
            Technical Specifications
            {#if activeTab === 'specs'}
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
            {/if}
          </button>
          <button 
            class="px-6 py-4 text-sm font-medium transition-colors relative {activeTab === 'features' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}"
            onclick={() => activeTab = 'features'}
          >
            Key Features
            {#if activeTab === 'features'}
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
            {/if}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="py-8 lg:py-12">
          {#if activeTab === 'specs'}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each product.specs as spec}
                <div class="p-6 bg-background rounded-lg border border-border">
                  <p class="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    {spec.label}
                  </p>
                  <p class="text-xl font-semibold">{spec.value}</p>
                </div>
              {/each}
            </div>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each product.features as feature}
                <div class="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                  <div class="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="font-medium">{feature}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </section>

    <!-- Related Products -->
    {#if relatedProducts.length > 0}
      <section class="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold tracking-tight">
            Related Products
          </h2>
          <a href="/products/{categorySlug}" class="text-sm font-medium flex items-center gap-2 hover:text-accent transition-colors">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {#each relatedProducts as relatedProduct}
            <a href="/products/{relatedProduct.categorySlug}/{relatedProduct.id}" class="group">
              <div class="flex gap-6 p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-all">
                <div class="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h3 class="font-semibold text-lg group-hover:text-accent transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p class="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {relatedProduct.shortDescription}
                  </p>
                  <p class="mt-2 font-semibold text-accent">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/if}

    <!-- CTA -->
    <section class="bg-foreground text-primary-foreground">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 class="text-2xl lg:text-3xl font-bold tracking-tight">
              Ready to transform your production?
            </h2>
            <p class="mt-2 text-primary-foreground/70">
              Get a personalized quote and consultation from our team.
            </p>
          </div>
          <Button size="lg" class="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  </div>

  <!-- Image Zoom Modal -->
  {#if imageZoomed}
    <div 
      class="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button 
        class="absolute top-4 right-4 w-12 h-12 bg-background text-foreground rounded-full flex items-center justify-center hover:bg-background/90 transition-colors"
        onclick={() => imageZoomed = false}
        aria-label="Close image"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        src={product.image} 
        alt={product.name}
        class="max-w-full max-h-[90vh] object-contain rounded-lg"
      />
    </div>
  {/if}
{:else}
  <div class="pt-20 lg:pt-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
      <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold mb-2">Product not found</h1>
      <p class="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <Button href="/">Browse Products</Button>
    </div>
  </div>
{/if}
