<script lang="ts">
  import type { ComponentProps } from "@uniformdev/canvas-svelte";
  import type { LinkParamValue, AssetParamValue } from "@uniformdev/canvas";
  import { flattenValues } from "@uniformdev/canvas";

  import HeroVideo from "$lib/components/hero/hero-video.svelte";
  import HeroAurora from "$lib/components/hero/hero-aurora.svelte";

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
      animationsEnabled?: boolean | string; // Uniform checkbox can be string "true"/"false"
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
    animationsEnabled,
    component, // Raw component data from Uniform
  }: Props = $props();

  // Extract href from LinkParamValue
  const ctaHref = $derived(ctaLink?.path || "");
  const secondaryHref = $derived(secondaryLink?.path || "");
  // Flatten asset to get media details
  const mediaAsset = $derived(flattenValues(media, { toSingle: true }));

  // Determine media type from asset
  const mediaUrl = $derived(mediaAsset?.url || "");

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
  // Uniform checkbox values come as strings ("true"/"false"), convert to boolean
  // Default to true when undefined (animations enabled by default)
  const resolvedAnimationsEnabled = $derived(() => {
    if (animationsEnabled === undefined || animationsEnabled === null) {
      return false; // default: animations enabled
    }
    if (typeof animationsEnabled === "string") {
      return animationsEnabled === "true";
    }
    return Boolean(animationsEnabled);
  });
</script>

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
    animationsEnabled={resolvedAnimationsEnabled()}
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
    animationsEnabled={resolvedAnimationsEnabled()}
  />
{/if}
