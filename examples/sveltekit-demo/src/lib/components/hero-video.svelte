<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    videoUrl: string;
    headline: string;
    subheadline: string;
    announcement: string;
    ctaLink: string;
    ctaText: string;
    secondaryLink: string;
    secondaryText: string;
  }

  let {
    videoUrl,
    headline,
    subheadline,
    announcement,
    ctaLink,
    ctaText,
    secondaryLink,
    secondaryText
  }: Props = $props();

  let videoElement: HTMLVideoElement;
  let isMuted = $state(true);

  // Cloudinary optimizations for video delivery
  // Add quality and format transformations for optimal performance
  const optimizedVideoUrl = $derived(() => {
    if (videoUrl.includes('cloudinary.com')) {
      // Insert quality and format optimizations before the version
      return videoUrl.replace(
        '/video/upload/',
        '/video/upload/q_auto,f_auto/'
      );
    }
    return videoUrl;
  });

  // Generate poster frame from first frame of video
  const posterUrl = $derived(() => {
    if (videoUrl.includes('cloudinary.com')) {
      return videoUrl
        .replace('/video/upload/', '/video/upload/so_0,f_auto,q_auto,w_1920/')
        .replace('.mp4', '.jpg');
    }
    return undefined;
  });

  function toggleMute() {
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      isMuted = videoElement.muted;
    }
  }

  onMount(() => {
    // Attempt to unmute after user interaction (browsers block autoplay with sound)
    // Video starts muted to ensure autoplay works, user can unmute
    if (videoElement) {
      videoElement.play().catch(() => {
        // Autoplay was prevented, video will remain paused
        console.log('[alex] Autoplay was prevented by browser');
      });
    }
  });
</script>

<!-- Hero Section - Full video background variant -->
<section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-14">
  <!-- Full-bleed background video -->
  <div class="absolute inset-0">
    <video
      bind:this={videoElement}
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      loop
      playsinline
      muted={isMuted}
      poster={posterUrl()}
      preload="auto"
    >
      <source src={optimizedVideoUrl()} type="video/mp4" />
      <!-- Fallback for browsers that don't support video -->
      Your browser does not support the video tag.
    </video>
    <!-- Dark overlay for text legibility -->
    <div class="absolute inset-0 bg-black/50"></div>
    <!-- Gradient overlay - darker at top for nav, darker at bottom for transition -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
  </div>
  
  <!-- Sound toggle button -->
  <button
    onclick={toggleMute}
    class="absolute bottom-24 right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
  >
    {#if isMuted}
      <!-- Muted icon -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    {:else}
      <!-- Unmuted icon -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    {/if}
  </button>
  
  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
    <!-- Announcement pill -->
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 animate-fade-up">
      <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
      <span class="text-sm font-medium text-white/90">{announcement}</span>
    </div>
    
    <!-- Main headline -->
    <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance animate-fade-up delay-100 text-white drop-shadow-lg" style="opacity: 0;">
      {headline}
    </h1>
    
    <p class="mt-6 text-xl md:text-2xl text-white/80 max-w-2xl mx-auto animate-fade-up delay-200 drop-shadow-md" style="opacity: 0;">
      {subheadline}
    </p>
    
    <!-- CTA Buttons -->
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300" style="opacity: 0;">
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
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce z-10">
    <span class="text-xs uppercase tracking-widest">Scroll</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>
