<script lang="ts">
  import { categories, products } from "$lib/data/products";
  import homeContent from "$lib/data/home-content.json";
  import ProductSpotlights from "$lib/components/sections/product-spotlights.svelte";
  import CategoryShowcase from "$lib/components/sections/category-showcase.svelte";
  import FeaturedProduct from "$lib/components/sections/featured-product.svelte";
  import ProductGrid from "$lib/components/sections/product-grid.svelte";
  import Newsletter from "$lib/components/sections/newsletter.svelte";
 
  import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
  import { componentMap } from '$lib/uniform/componentMap.js';
  const featuredSpotlightProduct = products[homeContent.productSpotlights.featuredProductIndex];
  const gridSpotlightProducts = homeContent.productSpotlights.gridProductIndices.map(i => products[i]);
  const featuredDeepDiveProduct = products[homeContent.featuredProduct.productIndex];

  let { data } = $props();
</script>

<svelte:head>
  <title>Cherry | Technology that feels like magic</title>
  <meta name="description" content="Technology that feels like magic. Devices that understand you. Welcome to the future of human potential." />
</svelte:head>

<UniformComposition
  data={data.data}
  {componentMap}
  matchedRoute={data.matchedRoute}
  dynamicInputs={data.dynamicInputs}
>
  <UniformSlot name="content" />
</UniformComposition>


<!-- Product Spotlights - Bento Grid -->
<ProductSpotlights
  eyebrow={homeContent.productSpotlights.eyebrow}
  headline={homeContent.productSpotlights.headline}
  featuredBadge={homeContent.productSpotlights.featuredBadge}
  learnMoreText={homeContent.productSpotlights.learnMoreText}
  featuredProduct={featuredSpotlightProduct}
  gridProducts={gridSpotlightProducts}
/>

<!-- Category Showcase -->
<CategoryShowcase
  headline={homeContent.categoryShowcase.headline}
  exploreText={homeContent.categoryShowcase.exploreText}
  {categories}
  categoryIcons={homeContent.categoryShowcase.categoryIcons}
/>

<!-- Featured Product Deep Dive -->
<FeaturedProduct
  product={featuredDeepDiveProduct}
  specsLimit={homeContent.featuredProduct.specsLimit}
  learnMoreText={homeContent.featuredProduct.learnMoreText}
/>

<!-- All Products Quick View -->
<ProductGrid
  headline={homeContent.productGrid.headline}
  subheadline={homeContent.productGrid.subheadline}
  viewText={homeContent.productGrid.viewText}
  {products}
/>

<!-- Newsletter / CTA -->
<Newsletter
  headline={homeContent.newsletter.headline}
  description={homeContent.newsletter.description}
  placeholder={homeContent.newsletter.placeholder}
  buttonText={homeContent.newsletter.buttonText}
  disclaimer={homeContent.newsletter.disclaimer}
/>

