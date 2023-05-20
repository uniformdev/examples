import * as React from "react";
import { CTA } from "./CTA";
import {
  UniformText,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

type HeroProps = {
  title: string;
  description: string;
  image: string;
  ctaTitle?: string;
  ctaLink?: string;
};

export const Hero = ({ image, ctaTitle, ctaLink }: HeroProps) => (
  <div className="grid grid-cols-2 py-[3em]">
    <div className="mb-5">
      <UniformText parameterId="title" as="h1" className="text-4xl mb-5" />
      <UniformText parameterId="description" as="p" className="mb-5" />
      {ctaTitle && ctaLink ? (
        <CTA title={<UniformText parameterId="ctaTitle" />} link={ctaLink} />
      ) : null}
    </div>
    {image ? (
      <div>
        <img src={image} width="500px" />
      </div>
    ) : null}
  </div>
);

registerUniformComponent({
  type: "hero",
  component: Hero,
});
