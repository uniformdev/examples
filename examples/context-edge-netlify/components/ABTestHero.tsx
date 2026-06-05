import { Test } from "@uniformdev/context-react";
import { ABTestHeroData } from "../lib/models";
import { Hero } from "./Hero";

export const ABTestHero: React.FC<ABTestHeroData> = ({
  variants,
}) => {
  return (
    <Test
      variations={variants}
      name="homeHeroTest"
      component={Hero}
    />
  );
};
