import { EnrichmentData, PersonalizedVariant } from "@uniformdev/context";

export enum ComponentType {
  PersonalizedHero = "personalizedhero",
  RegistrationForm = "registrationform",
  Hero = "hero",
}

export type PageComponentType =
  | HeroData
  | PersonalizedHeroData
  | RegistrationFormData;

export type BaseHeroData = {
  /** Title */
  title: string;

  /** Description */
  description: string;

  /** Button Text */
  buttonText: string;

  /** image */
  image: string | null;

  /** Button Link Slug */
  buttonLinkSlug: string;

  enrichments?: EnrichmentData;
};

export type PersonalizedHeroData = {
  type: ComponentType.PersonalizedHero;

  variations: (BaseHeroData & PersonalizedVariant)[];
};

export type RegistrationFormData = {
  type: ComponentType.RegistrationForm;

  /** Heading */
  heading: string;

  /** ButtonText */
  buttonText: string;

  /** Registered Text */
  registeredText: string;
};

export type HeroData = BaseHeroData & {
  type: ComponentType.Hero;
};

export type Page = {
  /** Title */
  title?: string;

  /** Slug */
  slug?: string;

  /** Components */
  components: PageComponentType[];
};
