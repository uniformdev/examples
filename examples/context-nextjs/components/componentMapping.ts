import { ComponentType } from "lib/models";
import { Hero } from "./Hero";
import { PersonalizedHero } from "./PersonalizedHero";
import { RegisterForm } from "./RegistrationForm";

export const componentMapping: Partial<
  Record<ComponentType, React.ComponentType<any>>
> = {
  [ComponentType.PersonalizedHero]: PersonalizedHero,
  [ComponentType.Hero]: Hero,
  [ComponentType.RegistrationForm]: RegisterForm,
};

export default componentMapping;
