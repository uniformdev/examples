import { EnrichmentData, PersonalizedVariant } from "@uniformdev/context";

export enum ComponentType {
  CallToAction = 'calltoaction',
  PersonalizedHero = 'personalizedhero',
  RegistrationForm = 'registrationform',
  TalkList = 'talklist',
  WhyAttend = 'whyattend',
  Hero = 'hero',
}

export type PageComponentType = CallToActionData | HeroData | PersonalizedHeroData | RegistrationFormData | TalksListData | WhyAttendData;

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

  beh?: EnrichmentData;
}

export type CallToActionData = {
  type: ComponentType.CallToAction;

  /** Heading */
  heading: string;

  /** Subheading */
  subheading: string;

  /** Button Link */
  buttonLink: string;

  /** Button Text */
  buttonText: string;
}

export type PersonalizedHeroData = {
  type: ComponentType.PersonalizedHero;

  variations: (BaseHeroData & PersonalizedVariant)[];
}

export type RegistrationFormData = {
  type: ComponentType.RegistrationForm;

  /** Heading */
  heading: string;

  /** ButtonText */
  buttonText: string;

  /** Registered Text */
  registeredText: string;
}

export type TalkData = PersonalizedVariant & {
  title: string;

  description: string;
  
  tags: string[];
}

export type TalksListData = {
  type: ComponentType.TalkList;

  /** Title */
  title: string;

  /** Title When Personalized */
  p13nTitle: string;

  /** NumberToShow */
  count: number;

  talks: TalkData[];
}

export type WhyAttendData = {
  type: ComponentType.WhyAttend;

  /** Title */
  title: string;

  /** Description */
  description: string;

  /** Image */
  image: string;
}

export type HeroData = BaseHeroData & {
  type: ComponentType.Hero;
}

export type Page = {
  /** Title */
  title?: string;

  /** Slug */
  slug?: string;

  /** Components */
  components: PageComponentType[];
}