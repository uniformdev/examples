"use client";

import { UniformPersonalize } from "@/uniform/UniformPersonalize";
import { Hero, HeroVariant } from "./Hero";

export const PersonalizedHero = ({
  variations,
}: {
  variations: HeroVariant[];
}) => {
  return (
    <UniformPersonalize
      variations={variations}
      name="heroPersonalized"
      component={Hero}
    />
  );
};
