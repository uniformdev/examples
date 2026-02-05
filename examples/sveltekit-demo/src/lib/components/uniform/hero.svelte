<!--
  Hero Adapter Component
  
  This adapter bridges Uniform's parameter types to the props expected by 
  HeroVideo and HeroAurora components. It handles:
  - Link parameters → simple href strings
  - Asset parameters → URL strings
  - Checkbox parameters → boolean values
  - Variant selection based on whether media is present
-->
<script lang="ts">
  import type { ComponentProps } from "@uniformdev/canvas-svelte";
  import type { LinkParamValue, AssetParamValue } from "@uniformdev/canvas";
  import { linkHref, assetUrl, checkbox } from "$lib/uniform/paramHelpers";

  import HeroVideo from "$lib/components/hero/hero-video.svelte";
  import HeroAurora from "$lib/components/hero/hero-aurora.svelte";

  interface Props extends ComponentProps<{
    media?: AssetParamValue;
    headline?: string;
    subheadline?: string;
    announcement?: string;
    ctaLink?: LinkParamValue;
    ctaText?: string;
    secondaryLink?: LinkParamValue;
    secondaryText?: string;
    animationsEnabled?: boolean | string;
  }> {}

  let {
    media,
    headline = "",
    subheadline = "",
    announcement = "",
    ctaLink,
    ctaText = "",
    secondaryLink,
    secondaryText = "",
    animationsEnabled,
  }: Props = $props();

  const ctaHref = $derived(linkHref(ctaLink));
  const secondaryHref = $derived(linkHref(secondaryLink));
  const videoUrl = $derived(assetUrl(media));
  const animated = $derived(checkbox(animationsEnabled, true));
  const hasVideo = $derived(Boolean(videoUrl));
</script>

{#if hasVideo}
  <HeroVideo
    {videoUrl}
    {headline}
    {subheadline}
    {announcement}
    ctaLink={ctaHref}
    {ctaText}
    secondaryLink={secondaryHref}
    {secondaryText}
    animationsEnabled={animated}
  />
{:else}
  <HeroAurora
    {headline}
    {subheadline}
    {announcement}
    ctaLink={ctaHref}
    {ctaText}
    secondaryLink={secondaryHref}
    {secondaryText}
    animationsEnabled={animated}
  />
{/if}
