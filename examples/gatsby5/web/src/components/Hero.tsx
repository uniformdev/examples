import * as React from "react";
import { CTA } from "./CTA";

type HeroProps = {
  content: {
    title: string;
    description: string;
    image: string;
    ctaTitle?: string;
    ctaLink?: string;
  };
};

export const Hero = ({ content }: HeroProps) => {
  const { title, description, image, ctaTitle, ctaLink } = content || {};
  return (
    <div className="grid grid-cols-2 py-[3em]">
      <div className="mb-5">
        <h1 className="text-4xl mb-5">{title}</h1>
        <p className="mb-5">{description}</p>
        {ctaTitle && ctaLink ? <CTA title={ctaTitle} link={ctaLink} /> : null}
      </div>
      {image ? (
        <div>
          <img src={image} width="500px" />
        </div>
      ) : null}
    </div>
  );
};
