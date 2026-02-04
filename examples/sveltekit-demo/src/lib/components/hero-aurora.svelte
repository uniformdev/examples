<script lang="ts">
  interface Props {
    headline?: string;
    subheadline?: string;
    announcement?: string;
    ctaLink?: string;
    ctaText?: string;
    secondaryLink?: string;
    secondaryText?: string;
  }

  let {
    headline = "Think beyond.",
    subheadline = "Technology that feels like magic. Devices that understand you. Welcome to the future of human potential.",
    announcement = "Introducing the 2030 Collection",
    ctaLink = "/products/neural",
    ctaText = "Explore Collection",
    secondaryLink = "/products/neural/neural-band-pro",
    secondaryText = "Watch the film"
  }: Props = $props();
</script>

<!-- Hero Section - Aurora animation variant -->
<section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-14">
  <!-- Dark base -->
  <div class="absolute inset-0 bg-gradient-to-b from-[hsl(240,20%,8%)] via-[hsl(260,15%,6%)] to-background"></div>
  
  <!-- Aurora layer 1 - Primary cherry glow -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-1/2 -left-1/4 w-[150%] h-full bg-gradient-to-br from-accent/30 via-transparent to-transparent rounded-full blur-3xl aurora-wave-1"></div>
  </div>
  
  <!-- Aurora layer 2 - Secondary pink/magenta -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-1/3 right-0 w-[80%] h-[120%] bg-gradient-to-bl from-[hsl(320,80%,50%)]/20 via-[hsl(280,70%,40%)]/10 to-transparent rounded-full blur-3xl aurora-wave-2"></div>
  </div>
  
  <!-- Aurora layer 3 - Accent streaks -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-0 left-1/4 w-1/2 h-[80%] bg-gradient-to-b from-accent/25 via-[hsl(340,90%,60%)]/15 to-transparent blur-2xl aurora-wave-3"></div>
  </div>
  
  <!-- Aurora layer 4 - Cyan/teal accent for contrast -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -bottom-1/4 -right-1/4 w-[60%] h-[80%] bg-gradient-to-tl from-[hsl(180,60%,40%)]/15 via-[hsl(200,70%,50%)]/10 to-transparent rounded-full blur-3xl aurora-wave-4"></div>
  </div>
  
  <!-- Starfield -->
  <div class="absolute inset-0 stars-container pointer-events-none">
    {#each Array(50) as _, i}
      <div 
        class="absolute w-0.5 h-0.5 bg-white rounded-full star-twinkle"
        style="left: {Math.random() * 100}%; top: {Math.random() * 60}%; animation-delay: {Math.random() * 4}s; opacity: {0.3 + Math.random() * 0.7};"
      ></div>
    {/each}
  </div>
  
  <!-- Mesh gradient overlay for depth -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,transparent_50%,hsl(0,0%,0%,0.4)_100%)]"></div>
  
  <!-- Animated glow orbs -->
  <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
  <div class="absolute bottom-1/3 left-1/5 w-64 h-64 bg-[hsl(320,70%,50%)]/15 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: -2s;"></div>
  <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-[hsl(200,60%,50%)]/10 rounded-full blur-2xl animate-float pointer-events-none" style="animation-delay: -4s;"></div>
  
  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
    <!-- Announcement pill -->
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 animate-fade-up">
      <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
      <span class="text-sm font-medium text-white/90">{announcement}</span>
    </div>
    
    <!-- Main headline -->
    <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance animate-fade-up delay-100 text-white" style="opacity: 0;">
      {headline}
    </h1>
    
    <p class="mt-6 text-xl md:text-2xl text-white/70 max-w-2xl mx-auto animate-fade-up delay-200" style="opacity: 0;">
      {subheadline}
    </p>
    
    <!-- CTA Buttons -->
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300" style="opacity: 0;">
      <a 
        href={ctaLink}
        class="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:gap-4"
      >
        {ctaText}
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      <a 
        href={secondaryLink}
        class="inline-flex items-center gap-2 px-8 py-4 text-white font-medium hover:text-accent transition-colors"
      >
        {secondaryText}
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </a>
    </div>
  </div>
  
  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce z-10">
    <span class="text-xs uppercase tracking-widest">Scroll</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>
