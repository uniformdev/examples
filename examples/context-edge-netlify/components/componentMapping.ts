import { ComponentType } from "lib/models";
import { Hero } from "./Hero";
import { PersonalizedHero } from "./PersonalizedHero";
import { RegisterForm } from "./RegistrationForm";
import { ABTestHero } from "./ABTestHero";

export const componentMapping: Partial<
  Record<ComponentType, React.ComponentType<any>>
> = {
  [ComponentType.PersonalizedHero]: PersonalizedHero,
  [ComponentType.ABTestHero]: ABTestHero,
  [ComponentType.Hero]: Hero,
  [ComponentType.RegistrationForm]: RegisterForm,
};

export default componentMapping;
