import type { ComponentMap } from '@uniformdev/canvas-svelte';

import { Card, Container, Grid, Hero, Page, RichText } from '$lib/components/index.js';

/**
 * Maps Uniform component types to Svelte components.
 * The key is the component type from Uniform Canvas.
 * Use `type__variant` format to map specific variants.
 */
export const componentMap: ComponentMap = {
  // Page types
  page: Page,

  // Layout components
  container: Container,
  grid: Grid,

  // Content components
  hero: Hero,
  card: Card,
  card__featured: Card, // Featured variant uses same component
  richText: RichText,
};
