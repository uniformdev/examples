import type { ComponentMap } from '@uniformdev/canvas-svelte';
import { Page, Hero } from '$lib/components/uniform/index.js';

/**
 * Maps Uniform component types to Svelte components.
 * The key is the component type from Uniform Canvas.
 * Use `type__variant` format to map specific variants.
 */
export const componentMap: ComponentMap = {
  // Composition types
  page: Page,

  // Hero component - all variants use the same adapter
  // Variants (to be created in Uniform): default (aurora), image, video
  hero: Hero,
};
