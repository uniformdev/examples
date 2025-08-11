"use client";

import { PersonalizedVariant } from "@uniformdev/context";
import { UniformPersonalize } from "@/uniform/UniformPersonalize";
import { Hero } from "./Hero";

export const PersonalizedHero = ({ content }: { content: PersonalizedVariant[] }) => {
  return (
    <UniformPersonalize
      variations={content}
      name="heroPersonalized"
      component={Hero}
    />
  );
};
