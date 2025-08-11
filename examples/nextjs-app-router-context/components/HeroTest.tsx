"use client";

import { UniformTest } from "@/uniform/UniformText";
import { Hero } from "./Hero";


export const HeroTest = ({ content }: any) => {
  return (
    <UniformTest
      variations={content}
      name="heroTest"
      component={Hero}
    />
  );
};
