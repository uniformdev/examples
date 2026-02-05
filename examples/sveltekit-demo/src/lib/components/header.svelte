<script lang="ts">
  import { categories } from "$lib/data/products";

  interface Props {
    darkHero?: boolean;
  }

  let { darkHero = false }: Props = $props();

  let mobileMenuOpen = $state(false);
  let scrolled = $state(false);

  // Use light text only when over dark hero AND not scrolled
  const useLightText = $derived(darkHero && !scrolled);

  $effect(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<header 
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 {scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : 'bg-transparent'}"
>
  <div class="max-w-6xl mx-auto px-6">
    <nav class="flex items-center justify-between h-14">
      <!-- Logo -->
      <a href="/" class="group flex items-center gap-2.5">
        <div class="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 32 32" class="w-full h-full" fill="none">
            <!-- Left cherry -->
            <circle cx="10" cy="22" r="8" fill="url(#cherryGradientL)" />
            <ellipse cx="7" cy="19" rx="2" ry="2.5" fill="white" opacity="0.35" />
            <!-- Right cherry -->
            <circle cx="22" cy="24" r="7" fill="url(#cherryGradientR)" />
            <ellipse cx="19.5" cy="21.5" rx="1.5" ry="2" fill="white" opacity="0.3" />
            <!-- Stems joining at top -->
            <path 
              d="M10 14 C10 8, 14 4, 18 3 M22 17 C22 12, 20 6, 18 3"
              stroke="hsl(25, 40%, 30%)"
              stroke-width="1.5"
              stroke-linecap="round"
              fill="none"
            />
            <!-- Leaf -->
            <path 
              d="M18 3 C20 1, 24 1, 26 3 C24 5, 20 5, 18 3"
              fill="hsl(130, 50%, 38%)"
            />
            <!-- Gradients -->
            <defs>
              <linearGradient id="cherryGradientL" x1="2" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="hsl(355, 90%, 62%)" />
                <stop offset="60%" stop-color="hsl(350, 85%, 48%)" />
                <stop offset="100%" stop-color="hsl(345, 80%, 35%)" />
              </linearGradient>
              <linearGradient id="cherryGradientR" x1="15" y1="17" x2="29" y2="31" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="hsl(355, 88%, 58%)" />
                <stop offset="60%" stop-color="hsl(350, 82%, 45%)" />
                <stop offset="100%" stop-color="hsl(345, 78%, 32%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="text-lg font-semibold tracking-tight transition-colors duration-500 {useLightText ? 'text-white' : 'text-foreground'}">cherry</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        {#each categories as category}
          <a 
            href="/products/{category.slug}" 
            class="text-sm font-medium transition-colors duration-200 relative group {useLightText ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}"
          >
            {category.name}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
          </a>
        {/each}
        <a 
          href="/" 
          class="text-sm font-medium transition-colors duration-200 {useLightText ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}"
        >
          Support
        </a>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        <button class="hidden md:flex w-8 h-8 items-center justify-center transition-colors {useLightText ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}" aria-label="Search">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
        <button class="hidden md:flex w-8 h-8 items-center justify-center transition-colors {useLightText ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}" aria-label="Cart">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
        
        <button 
          class="md:hidden p-2 -mr-2"
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          aria-label="Toggle menu"
        >
          <div class="w-5 h-4 relative flex flex-col justify-between">
            <span class="w-full h-0.5 transition-all duration-300 {useLightText ? 'bg-white' : 'bg-foreground'} {mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
            <span class="w-full h-0.5 transition-all duration-300 {useLightText ? 'bg-white' : 'bg-foreground'} {mobileMenuOpen ? 'opacity-0' : ''}"></span>
            <span class="w-full h-0.5 transition-all duration-300 {useLightText ? 'bg-white' : 'bg-foreground'} {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
          </div>
        </button>
      </div>
    </nav>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-fade-up">
      <div class="px-6 py-6 flex flex-col gap-6">
        {#each categories as category}
          <a 
            href="/products/{category.slug}" 
            class="text-2xl font-medium hover:text-accent transition-colors"
            onclick={() => mobileMenuOpen = false}
          >
            {category.name}
          </a>
        {/each}
        <a href="/" class="text-2xl font-medium hover:text-accent transition-colors">Support</a>
        <div class="pt-4 border-t border-border flex gap-6">
          <button class="text-muted-foreground hover:text-foreground" aria-label="Search">Search</button>
          <button class="text-muted-foreground hover:text-foreground" aria-label="Cart">Cart</button>
        </div>
      </div>
    </div>
  {/if}
</header>
