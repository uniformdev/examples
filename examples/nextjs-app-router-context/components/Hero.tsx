import { PersonalizedVariant } from "@uniformdev/context";

export type HeroVariant = PersonalizedVariant & {
  title: string;
};

export const Hero = ({ title }: HeroVariant) => {
  return <h1>{title}</h1>;
};
