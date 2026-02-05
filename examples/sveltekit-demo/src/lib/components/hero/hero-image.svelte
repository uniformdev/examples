<script lang="ts">
  interface Props {
    image: string;
    imageAlt: string;
    headline: string;
    subheadline: string;
    announcement: string;
    ctaLink: string;
    ctaText: string;
    secondaryLink: string;
    secondaryText: string;
    animationsEnabled?: boolean;
  }

  let {
    image,
    imageAlt,
    headline,
    subheadline,
    announcement,
    ctaLink,
    ctaText,
    secondaryLink,
    secondaryText,
    animationsEnabled = true
  }: Props = $props();
</script>

<!-- Hero Section - Full image background variant -->
<section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-14">
  <!-- Full-bleed background image -->
  <div 
    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style="background-image: url('{image}');"
  >
    <!-- Dark overlay for text legibility -->
    <div class="absolute inset-0 bg-black/40"></div>
    <!-- Gradient overlay - darker at top for nav, darker at bottom for transition -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
  </div>
  
  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
    <!-- Announcement pill -->
    {#if announcement}
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 {animationsEnabled ? 'animate-fade-up' : ''}">
        <span class="w-2 h-2 bg-accent rounded-full {animationsEnabled ? 'animate-pulse' : ''}"></span>
        <span class="text-sm font-medium text-white/90">{announcement}</span>
      </div>
    {/if}
    
    <!-- Main headline -->
    <h1 
      class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance text-white drop-shadow-lg {animationsEnabled ? 'animate-fade-up delay-100' : ''}"
      style={animationsEnabled ? 'opacity: 0;' : ''}
    >
      {headline}
    </h1>
    
    <p 
      class="mt-6 text-xl md:text-2xl text-white/80 max-w-2xl mx-auto drop-shadow-md {animationsEnabled ? 'animate-fade-up delay-200' : ''}"
      style={animationsEnabled ? 'opacity: 0;' : ''}
    >
      {subheadline}
    </p>
    
    <!-- CTA Buttons -->
    <div 
      class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 {animationsEnabled ? 'animate-fade-up delay-300' : ''}"
      style={animationsEnabled ? 'opacity: 0;' : ''}
    >
      <a 
        href={ctaLink}
        class="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:gap-4 shadow-lg"
      >
        {ctaText}
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      <a 
        href={secondaryLink}
        class="inline-flex items-center gap-2 px-8 py-4 text-white font-medium hover:text-accent transition-colors drop-shadow-md"
      >
        {secondaryText}
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </a>
    </div>
  </div>
  
  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 {animationsEnabled ? 'animate-bounce' : ''} z-10">
    <span class="text-xs uppercase tracking-widest">Scroll</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>
