/**
 * Mock AEM Content Services data
 * Simulates AEM Content Fragments / Content Services JSON Exporter format
 */

// Helper to extract URL from Uniform asset parameter
const getAssetUrl = (asset: { value?: { fields?: { url?: { value?: string } } }[] } | undefined): string => {
  return asset?.value?.[0]?.fields?.url?.value ?? '';
};

// Helper to extract link path from Uniform link parameter
const getLinkPath = (link: { value?: { path?: string } } | undefined): string => {
  return link?.value?.path ?? '';
};

// Helper to extract text value from Uniform parameter
const getText = (param: { value?: string } | undefined): string => {
  return param?.value ?? '';
};

// Helper to extract checkbox value
const getCheckbox = (param: { value?: boolean } | undefined): boolean => {
  return param?.value ?? false;
};

// Quick Link Item type
export interface QuickLinkItem {
  ':type': string;
  href: string;
  ariaLabel: string;
  imageUrl: string;
  imageAlt: string;
  label: string;
  analyticsTitle: string;
  target: string;
  rel: string;
}

// Quick Links Carousel type
export interface QuickLinksCarousel {
  ':type': string;
  items: QuickLinkItem[];
  carouselArrows: {
    previousAriaLabel: string;
    nextAriaLabel: string;
  };
}

// Hero Banner type
export interface HeroBanner {
  ':type': string;
  eyebrowText: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  ctaAriaLabel: string;
  backgroundImageMobile: string;
  backgroundImageTablet: string;
  backgroundImageDesktop: string;
  videoSourceDesktop: string;
  videoSourceTablet: string;
  videoSourceMobile: string;
  playButtonAriaLabel: string;
}

// Promo Banner type
export interface PromoBanner {
  ':type': string;
  headline: string;
  bodyText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  primaryCtaAriaLabel: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  secondaryCtaAriaLabel: string;
  backgroundImageMobile: string;
  backgroundImageTablet: string;
  backgroundImageDesktop: string;
}

// Editorial Card type
export interface EditorialCard {
  ':type': string;
  href: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaAriaLabel: string;
  gridArea: string;
  analyticsSection: string;
  analyticsTitle: string;
  hasMarginTop: boolean;
}

// Editorial Cards type
export interface EditorialCards {
  ':type': string;
  cards: EditorialCard[];
  carouselArrows: {
    previousAriaLabel: string;
    nextAriaLabel: string;
  };
}

// Standard Card type
export interface StandardCard {
  ':type': string;
  href: string;
  ariaLabel: string;
  title: string;
  imageUrl: string;
  analyticsTitle: string;
  mode: string;
  target: string;
  rel: string;
}

// Popular Categories type
export interface PopularCategories {
  ':type': string;
  sectionTitle: string;
  sectionAriaLabel: string;
  cards: StandardCard[];
}

// Sustainability Section type
export interface SustainabilitySection {
  ':type': string;
  eyebrowText: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  cards: StandardCard[];
}

// Category Card type
export interface CategoryCard {
  ':type': string;
  href: string;
  imageUrl: string;
  label: string;
  analyticsTitle: string;
}

// Product Category Grid type
export interface ProductCategoryGrid {
  ':type': string;
  sectionTitle: string;
  categories: CategoryCard[];
}

// Interest Categories type
export interface InterestCategories {
  ':type': string;
  sectionTitle: string;
  sectionAriaLabel: string;
  cards: StandardCard[];
}

// Value Proposition Item type
export interface ValuePropositionItem {
  ':type': string;
  iconUrl: string;
  iconAlt: string;
  title: string;
  description: string;
  linkHref: string;
  linkAriaLabel: string;
  linkText: string;
  linkAnalyticsTitle: string;
}

// Value Propositions type
export interface ValuePropositions {
  ':type': string;
  sectionTitle: string;
  sectionDescription: string;
  propositions: ValuePropositionItem[];
}

// Full page content type
export interface AemPageContent {
  ':path': string;
  ':type': string;
  'jcr:title': string;
  ':items': {
    quicklinkscarousel: QuickLinksCarousel;
    herobanner: HeroBanner;
    promobanner: PromoBanner;
    editorialcards: EditorialCards;
    popularcategories: PopularCategories;
    sustainabilitysection: SustainabilitySection;
    productcategorygrid: ProductCategoryGrid;
    interestcategories: InterestCategories;
    valuepropositions: ValuePropositions;
  };
}

// Quick Links Carousel data
export const quickLinksCarouselData: QuickLinksCarousel = {
  ':type': 'logitech/components/quicklinkscarousel',
  items: [
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/discover/c/mice',
      ariaLabel: 'Shop Mice',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/25c9b2d59919c50a7948528368aaf4c31cceaf4c.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Mice',
      label: 'Mice',
      analyticsTitle: 'mice',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/discover/c/keyboards',
      ariaLabel: 'Shop Keyboards',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/d81b4bee99ab8121878d92269a008e4fc9afe20b.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Keyboards',
      label: 'Keyboards',
      analyticsTitle: 'keyboards',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/shop/c/ipad-keyboards',
      ariaLabel: 'Shop Tablet Keyboard Cases',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/c7759118abb50e74e8a03cb3417c64ffcec161d4.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Tablet Keyboard Cases',
      label: 'Tablet Keyboard Cases',
      analyticsTitle: 'tablet-keyboard-cases',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitechg.com/en-us',
      ariaLabel: 'Shop Gaming',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/943efec94958b23acc7cc6c7573c42bf93fe958d.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Gaming',
      label: 'Gaming',
      analyticsTitle: 'gaming',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/shop/deals',
      ariaLabel: 'Explore deals',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/765d8421b5c5c034d3a040ca57cdfb0c34e493c4.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Deals',
      label: 'Deals',
      analyticsTitle: 'deals',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/shop/c/webcams',
      ariaLabel: 'Shop webcams',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/0744df768ef0eb379c6c03bfbf36bbf36286f25d.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Webcams',
      label: 'Webcams',
      analyticsTitle: 'webcams',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/shop/c/combos',
      ariaLabel: 'Shop Combos',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/fba7056b379eaa3f1089d33125cc4404ab72baa6.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Combos',
      label: 'Combos',
      analyticsTitle: 'combos',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/discover/c/ultimate-ears',
      ariaLabel: 'Shop Ultimate ears',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/69811cf6f6850ead7d96cd2be9af10794e46589b.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Ultimate Ears',
      label: 'Ultimate Ears',
      analyticsTitle: 'ultimate-ears',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/quicklinkitem',
      href: 'https://www.logitech.com/en-us/shop/c/headsets',
      ariaLabel: 'Shop Headsets',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/2b089d778006d7a65087c265d127e7531c3b9c2e.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      imageAlt: 'Headsets',
      label: 'Headsets',
      analyticsTitle: 'planet--people',
      target: '',
      rel: '',
    },
  ],
  carouselArrows: {
    previousAriaLabel: 'Previous',
    nextAriaLabel: 'Next',
  },
};

// Hero Banner data
export const heroBannerData: HeroBanner = {
  ':type': 'logitech/components/herobanner',
  eyebrowText: 'MX Master 4',
  headline: 'A new sense of mastery ',
  bodyText: 'Redefine precision and immersive control',
  ctaText: 'SHOP MX MASTER 4',
  ctaLink: 'https://www.logitech.com/en-us/shop/p/mx-master-4',
  ctaAriaLabel: 'Shop MX Master 4 ',
  backgroundImageMobile: 'https://resource.logitech.com/w_840,ar_16:9,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/mx-master-4-reveal-mobile.jpg',
  backgroundImageTablet: 'https://resource.logitech.com/w_1240,h_625,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/mx-master-4-reveal-desktop.jpg',
  backgroundImageDesktop: 'https://resource.logitech.com/w_1900,h_625,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/mx-master-4-reveal-desktop.jpg',
  videoSourceDesktop: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/source/084ba267f35ac196eabb491adf90a58faf54b37a.mp4;codecs=avc1?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
  videoSourceTablet: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/source/c8631254b6b2573848451399bbb0c306936380f1.mp4;codecs=avc1?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
  videoSourceMobile: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/source/e966e051e2c2307c9e16ab4c25d883a769e0913f.mp4;codecs=avc1?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
  playButtonAriaLabel: 'Play video',
};

// Promo Banner data
export const promoBannerData: PromoBanner = {
  ':type': 'logitech/components/promobanner',
  headline: 'Gifts for everyone on your list',
  bodyText: 'Buy More and Save\n$150 off orders of $450\n$70 off $250,\nand $30 off $150.\nPlus free Express Shipping on orders over $150',
  primaryCtaText: 'SHOP DEALS',
  primaryCtaLink: 'https://www.logitech.com/en-us/shop/deals',
  primaryCtaAriaLabel: 'Shop Now for your deals',
  secondaryCtaText: 'SHOP GIFT IDEAS',
  secondaryCtaLink: 'https://www.logitech.com/en-us/campaigns/gift-guide',
  secondaryCtaAriaLabel: 'Shop Now for your gift list',
  backgroundImageMobile: 'https://resource.logitech.com/w_840,ar_16:9,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/last-minute-express-shipping-casa-zone-vibe-100-mobile.jpg',
  backgroundImageTablet: 'https://resource.logitech.com/w_1240,h_600,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/last-minute-express-shipping-casa-zone-vibe-100-desktop.jpg',
  backgroundImageDesktop: 'https://resource.logitech.com/w_1900,h_600,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/homepage/banners/background-banner/last-minute-express-shipping-casa-zone-vibe-100-desktop.jpg',
};

// Editorial Cards data
export const editorialCardsData: EditorialCards = {
  ':type': 'logitech/components/editorialcards',
  cards: [
    {
      ':type': 'logitech/components/editorialcard',
      href: 'https://www.logitech.com/en-us/campaigns/mx-master-4-product-ecosystem',
      title: 'Shop MX Master 4 & Save On Your Ultimate Setup ',
      description: 'Save up to $100 when you bundle the MX Master 4 with select workspace products.',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/4638de6e4e3282a64a7f8d5ba87cb1f22f560937.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      ctaText: 'SHOP NOW',
      ctaAriaLabel: 'Click on the link to shop now',
      gridArea: 'A',
      analyticsSection: 'static_banner_1',
      analyticsTitle: 'Shop now',
      hasMarginTop: true,
    },
    {
      ':type': 'logitech/components/editorialcard',
      href: 'https://www.logitech.com/en-us/shop/p/signature-slim-solar-plus',
      title: 'Bundle & Save with the Signature Slim Solar+ Keyboard',
      description: "Shop the new Signature Slim Solar+ Keyboard that's powered by solar and artificial light sources. Bundle and save 30% on select mice for a seamless workspace upgrade.",
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/06924ab5616e5a150ebb0ca6202dd9e40aaa8001.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      ctaText: 'SHOP NOW',
      ctaAriaLabel: 'Shop the new Signature Slim Solar+ Keyboard',
      gridArea: 'B',
      analyticsSection: 'static_banner_2',
      analyticsTitle: 'Shop now',
      hasMarginTop: false,
    },
    {
      ':type': 'logitech/components/editorialcard',
      href: 'https://www.logitech.com/en-us/shop/p/alto-keys-k98m',
      title: 'Shop the NEW Alto Keys K98M',
      description: 'Meet our newest wireless mechanical keyboard, designed for next-level typing satisfaction. Save when you purchase it together with the new MX Master 4.',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/445aa4d2ac9d89746b399ecf0636d777bff79016.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      ctaText: 'SHOP NOW',
      ctaAriaLabel: 'Click on the link to Shop now',
      gridArea: 'C',
      analyticsSection: 'static_banner_3',
      analyticsTitle: 'Shop Now ',
      hasMarginTop: true,
    },
    {
      ':type': 'logitech/components/editorialcard',
      href: 'https://www.logitech.com/en-us/shop/p/flip-folio',
      title: 'Free POP Mouse With Flip Folio',
      description: 'Buy a Flip Folio and get a FREE POP Mouse in matching colors, an ideal pair for style and practicality. Limited time offer.',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/9d45a0243672cc9fb322534700497fa8e73020a2.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      ctaText: 'SHOP NOW',
      ctaAriaLabel: 'Click on the link to shop flip folio',
      gridArea: 'D',
      analyticsSection: 'static_banner_4',
      analyticsTitle: 'Shop now',
      hasMarginTop: false,
    },
    {
      ':type': 'logitech/components/editorialcard',
      href: 'https://www.logitech.com/en-us/programs/sheer-id',
      title: 'Students and Heroes save 25% ',
      description: 'Verified Students, Teachers, Medical Professionals, Military & First Responders can receive 25% off their next purchase.',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/e24c488f44783cf0039e73ef3cab90cbe5b61aba.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      ctaText: 'LEARN MORE',
      ctaAriaLabel: 'Learn more about the program',
      gridArea: 'E',
      analyticsSection: 'static_banner_5',
      analyticsTitle: 'Learn More',
      hasMarginTop: false,
    },
  ],
  carouselArrows: {
    previousAriaLabel: 'Previous',
    nextAriaLabel: 'Next',
  },
};

// Popular Categories data
export const popularCategoriesData: PopularCategories = {
  ':type': 'logitech/components/popularcategories',
  sectionTitle: 'Discover our most popular product categories',
  sectionAriaLabel: 'Discover our most popular product categories',
  cards: [
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitech.com/en-us/discover/c/keyboards',
      ariaLabel: 'Keyboards',
      title: 'Keyboards',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/cb2b060ddd42928c77f4d44dd84f29d2954f7c5f.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'keyboards',
      mode: 'light',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitech.com/en-us/discover/c/mice',
      ariaLabel: 'Mice',
      title: 'Mice',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/7a2be819eaa8a74e9210fbc3f9e5584390a607a7.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'mice',
      mode: 'light',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitech.com/en-us/discover/c/webcams',
      ariaLabel: 'Webcams',
      title: 'Webcams',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/9193d75527e7cb9efbe972ca30e9843277001eff.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'webcams',
      mode: 'light',
      target: '',
      rel: '',
    },
  ],
};

// Sustainability Section data
export const sustainabilitySectionData: SustainabilitySection = {
  ':type': 'logitech/components/sustainabilitysection',
  eyebrowText: 'Design for sustainability',
  headline: 'Everything matters',
  description: "When it comes to doing better for our planet, it's on us. Every component. Every process. Every product.",
  ctaText: 'LEARN ABOUT OUR COMMITMENT',
  ctaLink: 'https://www.logitech.com/en-us/planet-and-people/everything-matters',
  cards: [
    {
      ':type': 'logitech/components/standardcard',
      href: '',
      ariaLabel: 'Labels matters',
      title: 'Labels matters',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/a103f336e9399bf3b87ff226db5e728e5dabd156.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'labels-matters',
      mode: 'dark',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: '',
      ariaLabel: 'Doing better matters',
      title: 'Doing better matters',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/1a304a3b0f41ec9fa552af3ebd61226a1c6834ca.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'doing-better-matters',
      mode: 'dark',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: '',
      ariaLabel: 'Working together matters',
      title: 'Working together matters',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/ca256443b82700414ebbc50cea722f0c66d6eb2e.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'working-together-matters',
      mode: 'dark',
      target: '',
      rel: '',
    },
  ],
};

// Product Category Grid data
export const productCategoryGridData: ProductCategoryGrid = {
  ':type': 'logitech/components/productcategorygrid',
  sectionTitle: 'Shop by product category',
  categories: [
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/keyboards',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/1d0e872b89928c4aa6d7e7c26c9a3e6ca682917f.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Keyboards and Consoles',
      analyticsTitle: 'keyboards',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/combos',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/5ecfac26607777eaa1b07cf489b77e265ff389f9.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Combos',
      analyticsTitle: 'combos',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/mice',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/bd280eb43990b1100ed71373179f37620391e6ac.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Mice',
      analyticsTitle: 'mice',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/speakers',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/d98cbd25d0463f9aa1e8759a9491e93bd0533827.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Speakers',
      analyticsTitle: 'speakers',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/conference-cameras',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/6b6deaa19f4fadb8be263811f46677f314765056.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Conference Cameras',
      analyticsTitle: 'conference-cameras',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/driving',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/aa3678a6afc0499b970d60366dd2353d6b945151.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Driving',
      analyticsTitle: 'driving',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/headsets',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/bd56aeb3f712a8ce6aef289ddb6bf6c7b27afaf0.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Headsets',
      analyticsTitle: 'headsets',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/cameras-lighting',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/a7eeeaff60dd2c7bc662fed8ded007af53a5e65c.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Lighting',
      analyticsTitle: 'cameras-lighting',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/webcams',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/89483d6c2085d21113777ee3b2f2c51c9ef3d1b2.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Webcams',
      analyticsTitle: 'webcams',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/microphones',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/51ecd6fccde60e038de6384fa28f5ce8d4562152.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Microphones',
      analyticsTitle: 'microphones',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/ipad-keyboards',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/fc0afa5db7f0a3ed45727ec9d76d4830dd075e6b.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'iPad Keyboard Cases',
      analyticsTitle: 'ipad-keyboards',
    },
    {
      ':type': 'logitech/components/categorycard',
      href: 'https://www.logitech.com/en-us/shop/c/certified-refurb',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/5074c23e2ddae6d69d3656b975a60f4c2de440e5.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      label: 'Refurbished Products',
      analyticsTitle: 'certified-refurb',
    },
  ],
};

// Interest Categories data
export const interestCategoriesData: InterestCategories = {
  ':type': 'logitech/components/interestcategories',
  sectionTitle: 'Shop by interest',
  sectionAriaLabel: 'Shop by interest',
  cards: [
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitech.com/en-us/business',
      ariaLabel: 'Business',
      title: 'Business',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/ee86b7f725e0cae0eb1b652182ace9451dffdbca.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'business',
      mode: 'dark',
      target: '',
      rel: '',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitechg.com/en-us',
      ariaLabel: 'Gaming',
      title: 'Gaming',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/74cfd827d3be9ae14b5b74d13fb9b4a48004387f.jpg?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'gaming',
      mode: 'dark',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      ':type': 'logitech/components/standardcard',
      href: 'https://www.logitech.com/en-us/education',
      ariaLabel: 'Education',
      title: 'Education',
      imageUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/23cb88b1de7433acc08aa0b279736f8e8469902f.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      analyticsTitle: 'education',
      mode: 'dark',
      target: '',
      rel: '',
    },
  ],
};

// Value Propositions data
export const valuePropositionsData: ValuePropositions = {
  ':type': 'logitech/components/valuepropositions',
  sectionTitle: 'Reasons to buy from Logitech.com',
  sectionDescription: "We're all about making your shopping experience seamless. Shop direct and enjoy perks like free shipping, multiple payment options, easy returns, and access to exclusive offers only on logitech.com.",
  propositions: [
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/d95167321aab38fe87137e3a0260bf2336db230a.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: 'Buy now, pay later',
      title: 'Buy now, pay later',
      description: 'Pay at your own pace with Klarna payment plans. Get what you love, choose how you pay..',
      linkHref: '',
      linkAriaLabel: '',
      linkText: '',
      linkAnalyticsTitle: '',
    },
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/f62a94c00b26822814dd41bb33125bac74eda0c7.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: 'Free shipping',
      title: 'Free shipping',
      description: 'Enjoy free standard shipping on all orders over $49.',
      linkHref: '',
      linkAriaLabel: '',
      linkText: '',
      linkAnalyticsTitle: '',
    },
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/ea7b1608809df7e5ff437d80fd8b951ea2243c06.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: 'Students and Heroes get 25% Off',
      title: 'Students and Heroes get 25% Off',
      description: "Students and Heroes can benefit from a 25% discount on Logitech products. It couldn't be easier.",
      linkHref: 'https://www.logitech.com/en-us/programs/sheer-id',
      linkAriaLabel: 'Click here to verify the status',
      linkText: 'GET VERIFIED',
      linkAnalyticsTitle: 'get-verified',
    },
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/0d7fe9338e98c0a1b4d6c2737e73ed630dafe712.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: 'Money-back guarantee',
      title: 'Money-back guarantee',
      description: 'Shop risk-free with our easy returns and 30-day money back guarantee.',
      linkHref: '',
      linkAriaLabel: '',
      linkText: '',
      linkAnalyticsTitle: '',
    },
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/9b9ad8a0454b3bdb82cbfc804d85cd0ea0af37cf.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: '24/7 customer service',
      title: '24/7 customer service',
      description: "We're here for you whenever you need. Reach us via chat, phone, or email for your convenience.",
      linkHref: '',
      linkAriaLabel: '',
      linkText: '',
      linkAnalyticsTitle: '',
    },
    {
      ':type': 'logitech/components/valuepropositionitem',
      iconUrl: 'https://ai-demo-hub-git-migration-lo-e762cf-uniform-engineering-sandbox.vercel.app/img/2f9001ef61fe86124a91feb04bf5a83e9460dd61.png?x-vercel-protection-bypass=superSecret1245gghfMessageGoesHe',
      iconAlt: 'Exclusive offers',
      title: 'Exclusive offers',
      description: 'Unlock exclusive gifts when you purchase select products. Sign up for emails to stay up-to-date on offers.',
      linkHref: '',
      linkAriaLabel: '',
      linkText: '',
      linkAnalyticsTitle: '',
    },
  ],
};

// Full page content
export const fullPageContent: AemPageContent = {
  ':path': '/content/logitech/en-us/home',
  ':type': 'logitech/components/page',
  'jcr:title': 'Home',
  ':items': {
    quicklinkscarousel: quickLinksCarouselData,
    herobanner: heroBannerData,
    promobanner: promoBannerData,
    editorialcards: editorialCardsData,
    popularcategories: popularCategoriesData,
    sustainabilitysection: sustainabilitySectionData,
    productcategorygrid: productCategoryGridData,
    interestcategories: interestCategoriesData,
    valuepropositions: valuePropositionsData,
  },
};

// Component map for easy lookup
export const componentDataMap: Record<string, unknown> = {
  quicklinkscarousel: quickLinksCarouselData,
  herobanner: heroBannerData,
  promobanner: promoBannerData,
  editorialcards: editorialCardsData,
  popularcategories: popularCategoriesData,
  sustainabilitysection: sustainabilitySectionData,
  productcategorygrid: productCategoryGridData,
  interestcategories: interestCategoriesData,
  valuepropositions: valuePropositionsData,
};

