<script lang="ts">
  import { categories, products } from "$lib/data/products";
  import homeContent from "$lib/data/home-content.json";
  import HeroVideo from "$lib/components/hero-video.svelte";
  import ProductSpotlights from "$lib/components/sections/product-spotlights.svelte";
  import CategoryShowcase from "$lib/components/sections/category-showcase.svelte";
  import FeaturedProduct from "$lib/components/sections/featured-product.svelte";
  import ProductGrid from "$lib/components/sections/product-grid.svelte";
  import Newsletter from "$lib/components/sections/newsletter.svelte";
  // Alternative hero variants:
  // import HeroImage from "$lib/components/hero-image.svelte";
  // import HeroAurora from "$lib/components/hero-aurora.svelte";

  // Derive product data from content config
  const featuredSpotlightProduct = products[homeContent.productSpotlights.featuredProductIndex];
  const gridSpotlightProducts = homeContent.productSpotlights.gridProductIndices.map(i => products[i]);
  const featuredDeepDiveProduct = products[homeContent.featuredProduct.productIndex];
</script>

<!-- Hero Section - Video Background Variant -->
<HeroVideo
  videoUrl={homeContent.hero.videoUrl}
  headline={homeContent.hero.headline}
  subheadline={homeContent.hero.subheadline}
  announcement={homeContent.hero.announcement}
  ctaLink={homeContent.hero.ctaLink}
  ctaText={homeContent.hero.ctaText}
  secondaryLink={homeContent.hero.secondaryLink}
  secondaryText={homeContent.hero.secondaryText}
/>

<!-- Alternative hero variants usage:
<HeroImage
  image={homeContent.hero.image}
  imageAlt={homeContent.hero.imageAlt}
  headline={homeContent.hero.headline}
  subheadline={homeContent.hero.subheadline}
  announcement={homeContent.hero.announcement}
  ctaLink={homeContent.hero.ctaLink}
  ctaText={homeContent.hero.ctaText}
  secondaryLink={homeContent.hero.secondaryLink}
  secondaryText={homeContent.hero.secondaryText}
/>

<HeroAurora
  headline={homeContent.hero.headline}
  subheadline={homeContent.hero.subheadline}
  announcement={homeContent.hero.announcement}
  ctaLink={homeContent.hero.ctaLink}
  ctaText={homeContent.hero.ctaText}
  secondaryLink={homeContent.hero.secondaryLink}
  secondaryText={homeContent.hero.secondaryText}
/>
-->

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
