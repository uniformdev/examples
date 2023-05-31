import * as React from "react";
import { registerUniformComponent } from "@uniformdev/canvas-react";

type HeroProps = {
  title: string;
  description: string;
  image: string;
  ctaTitle?: string;
  ctaLink?: string;
};

export const Hero = ({ ctaTitle }: HeroProps) => <h1>{ctaTitle}</h1>;

registerUniformComponent({
  type: "hero",
  component: Hero,
});
