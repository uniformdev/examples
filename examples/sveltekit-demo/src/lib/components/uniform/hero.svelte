<script lang="ts">
  import type { ComponentProps } from "@uniformdev/canvas-svelte";
  import type { LinkParamValue, AssetParamValue } from "@uniformdev/canvas";
  import { flattenValues } from "@uniformdev/canvas";

  // Import all hero variants
  import HeroVideo from "$lib/components/hero-video.svelte";
  // import HeroImage from "$lib/components/hero-image.svelte";
  import HeroAurora from "$lib/components/hero-aurora.svelte";

  interface Props
    extends ComponentProps<{
      media?: AssetParamValue;
      headline?: string;
      subheadline?: string;
      announcement?: string;
      ctaLink?: LinkParamValue;
      ctaText?: string;
      secondaryLink?: LinkParamValue;
      secondaryText?: string;
    }> {}

  let {
    media,
    headline,
    subheadline,
    announcement,
    ctaLink,
    ctaText,
    secondaryLink,
    secondaryText,
  }: Props = $props();

  // Extract href from LinkParamValue
  const ctaHref = $derived(ctaLink?.path || "");
  const secondaryHref = $derived(secondaryLink?.path || "");
  // Flatten asset to get media details
  const mediaAsset = $derived(flattenValues(media, { toSingle: true }));

  // Determine media type from asset
  // Future:const mediaType = $derived(mediaAsset?.mediaType?.split("/")[0] || "none");
  const mediaUrl = $derived(mediaAsset?.url || "");
  // const mediaTitle = $derived(mediaAsset?.title || "");

  // Get variant from component (will be set by author in Uniform)
  // Future: Variants: default (aurora), image, video
  //const variant = $derived(component?.variant || "");

  // Future: Determine which hero to render based on variant or media type
  // function getHeroType(): "video" | "image" | "aurora" {
  //   // If variant is explicitly set, use it
  //   if (variant === "video") return "video";
  //   if (variant === "image") return "image";
  //   if (variant === "aurora" || variant === "default" || variant === "") {
  //     // Auto-detect from media type if no variant set
  //     if (mediaType === "video") return "video";
  //     if (mediaType === "image") return "image";
  //     return "aurora";
  //   }
  //   return "aurora";
  // }

  //const heroType = $derived(getHeroType());

  // Check if we have all required content
  const hasRequiredContent = $derived(
    Boolean(headline && subheadline && ctaHref && ctaText),
  );

  // Resolved values for template (with defaults to satisfy type checker)
  const resolvedHeadline = $derived(headline ?? "");
  const resolvedSubheadline = $derived(subheadline ?? "");
  const resolvedAnnouncement = $derived(announcement ?? "");
  const resolvedCtaText = $derived(ctaText ?? "");
  const resolvedSecondaryText = $derived(secondaryText ?? "");
  //const resolvedMediaAlt = $derived(mediaTitle ?? headline ?? "");
</script>


{#if hasRequiredContent}
  {#if mediaUrl}
    <HeroVideo
      videoUrl={mediaUrl}
      headline={resolvedHeadline}
      subheadline={resolvedSubheadline}
      announcement={resolvedAnnouncement}
      ctaLink={ctaHref}
      ctaText={resolvedCtaText}
      secondaryLink={secondaryHref}
      secondaryText={resolvedSecondaryText}
    />
  {:else}
    <HeroAurora
      headline={resolvedHeadline}
      subheadline={resolvedSubheadline}
      announcement={resolvedAnnouncement}
      ctaLink={ctaHref}
      ctaText={resolvedCtaText}
      secondaryLink={secondaryHref}
      secondaryText={resolvedSecondaryText}
    />
  {/if}
{/if} 

<!-- future:{#if hasRequiredContent}
  {#if heroType === "video" && mediaUrl}
    <HeroVideo
      videoUrl={mediaUrl}
      headline={resolvedHeadline}
      subheadline={resolvedSubheadline}
      announcement={resolvedAnnouncement}
      ctaLink={ctaHref}
      ctaText={resolvedCtaText}
      secondaryLink={secondaryHref}
      secondaryText={resolvedSecondaryText}
    />
 {:else if heroType === "image" && mediaUrl}
    <HeroImage
      image={mediaUrl}
      imageAlt={resolvedMediaAlt}
      headline={resolvedHeadline}
      subheadline={resolvedSubheadline}
      announcement={resolvedAnnouncement}
      ctaLink={ctaHref}
      ctaText={resolvedCtaText}
      secondaryLink={secondaryHref}
      secondaryText={resolvedSecondaryText}
    />
  {:else}
    <HeroAurora
      headline={resolvedHeadline}
      subheadline={resolvedSubheadline}
      announcement={resolvedAnnouncement}
      ctaLink={ctaHref}
      ctaText={resolvedCtaText}
      secondaryLink={secondaryHref}
      secondaryText={resolvedSecondaryText}
    />
  {/if}
{/if} -->
