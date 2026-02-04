<script lang="ts">
  import { categories, products, formatPrice } from "$lib/data/products";
  import HeroVideo from "$lib/components/hero-video.svelte";
  // Alternative variants:
  // import HeroImage from "$lib/components/hero-image.svelte";
  // import HeroAurora from "$lib/components/hero-aurora.svelte";

  const featuredProduct = products[0]; // Neural Band Pro
  const heroProducts = products.slice(0, 3);
</script>

<!-- Hero Section - Video Background Variant -->
<HeroVideo />

<!-- Product Spotlights - Bento Grid -->
<section class="py-24 md:py-32">
  <div class="max-w-6xl mx-auto px-6">
    <!-- Section header -->
    <div class="text-center mb-16">
      <p class="text-sm font-medium text-accent uppercase tracking-widest mb-4">The Lineup</p>
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
        Six devices. Infinite possibilities.
      </h2>
    </div>
    
    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <!-- Featured large card -->
      <a href="/products/neural/neural-band-pro" class="group md:row-span-2 relative rounded-3xl overflow-hidden bg-secondary">
        <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="p-8 md:p-10 h-full flex flex-col">
          <div class="mb-4">
            <p class="text-accent font-medium mb-1">New</p>
            <h3 class="text-2xl md:text-3xl font-semibold">{products[0].name}</h3>
            <p class="text-muted-foreground mt-2">{products[0].tagline}</p>
          </div>
          <div class="flex-1 flex items-center justify-center py-8">
            <img 
              src={products[0].image} 
              alt={products[0].name}
              class="w-full max-w-sm h-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">{formatPrice(products[0].price)}</span>
            <span class="inline-flex items-center gap-1 text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </a>
      
      <!-- Smaller cards -->
      {#each products.slice(2, 4) as product, i}
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

<!-- Category Showcase - Full-width immersive cards -->
<section class="py-24 md:py-32 bg-foreground text-primary-foreground">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-semibold tracking-tight">
        Explore by category
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
              {#if category.slug === 'neural'}
                <svg class="w-10 h-10 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              {:else if category.slug === 'vision'}
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
              Explore
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

<!-- Featured Product Deep Dive -->
<section class="py-24 md:py-32">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <!-- Product Image -->
      <div class="relative group order-2 lg:order-1">
        <div class="absolute -inset-8 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <img 
          src={products[4].image}
          alt={products[4].name}
          class="w-full h-auto animate-float"
        />
      </div>
      
      <!-- Product Info -->
      <div class="order-1 lg:order-2">
        <p class="text-accent font-medium mb-4">{products[4].category}</p>
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          {products[4].name}
        </h2>
        <p class="text-2xl text-muted-foreground mb-6">
          {products[4].tagline}
        </p>
        <p class="text-muted-foreground leading-relaxed mb-8">
          {products[4].description}
        </p>
        
        <!-- Key specs -->
        <div class="grid grid-cols-2 gap-4 mb-10">
          {#each products[4].specs.slice(0, 4) as spec}
            <div class="p-4 rounded-xl bg-secondary">
              <p class="text-sm text-muted-foreground">{spec.label}</p>
              <p class="font-semibold mt-1">{spec.value}</p>
            </div>
          {/each}
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <a 
            href="/products/{products[4].categorySlug}/{products[4].id}"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
          >
            Learn more
          </a>
          <span class="inline-flex items-center justify-center px-8 py-4 text-xl font-semibold">
            {formatPrice(products[4].price)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- All Products Quick View -->
<section class="py-24 md:py-32 bg-secondary/50">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">
          The complete lineup
        </h2>
        <p class="text-muted-foreground mt-2">Every device, designed to work together.</p>
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
                View
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

<!-- Newsletter / CTA -->
<section class="py-24 md:py-32">
  <div class="max-w-3xl mx-auto px-6 text-center">
    <div class="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent to-[hsl(350,70%,65%)] flex items-center justify-center">
      <svg class="w-8 h-8 text-accent-foreground" viewBox="0 0 24 24" fill="none">
        <!-- Left cherry -->
        <circle cx="8" cy="17" r="5.5" fill="currentColor" />
        <!-- Right cherry -->
        <circle cx="16" cy="18" r="5" fill="currentColor" />
        <!-- Stems -->
        <path d="M8 11.5 C8 7, 11 4, 14 3 M16 13 C16 9, 15 5, 14 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <!-- Leaf -->
        <path d="M14 3 C15.5 1.5, 18 1.5, 19.5 3 C18 4.5, 15.5 4.5, 14 3" fill="currentColor" />
      </svg>
    </div>
    <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
      The future is closer than you think
    </h2>
    <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
      Get early access to new products, exclusive events, and a glimpse into what's next from Cherry.
    </p>
    <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="Enter your email"
        class="flex-1 px-6 py-4 rounded-full bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button 
        type="submit"
        class="px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
      >
        Join
      </button>
    </form>
    <p class="text-xs text-muted-foreground mt-4">
      By signing up, you agree to our Privacy Policy. No spam, ever.
    </p>
  </div>
</section>
