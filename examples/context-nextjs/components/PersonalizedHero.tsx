import { Personalize } from "@uniformdev/context-react";
import { PersonalizedHeroData } from "../lib/models";
import { Hero } from "./Hero";

export const PersonalizedHero: React.FC<PersonalizedHeroData> = ({
  variations,
}) => {
  return (
    <Personalize
      variations={variations}
      name="heroPersonalized"
      component={Hero}
    />
  );
};
