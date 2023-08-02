import * as React from "react";
import { CTA } from "./CTA";
import { registerUniformComponent } from "@uniformdev/canvas-react";

type Image = {
  url: string;
  width: number;
  height: number;
};

type HeroProps = {
  title: string;
  description: string;
  image: string;
  ctaTitle?: string;
  ctaLink?: string;
  content: {
    elements: {
      title: { value: string };
      description: { value: string };
      ctaTitle: { value: string };
      ctaLink: { value: string };
      image: { value: Array<Image> };
    };
  };
};

export const Hero = ({ content }: HeroProps) => {
  const { title, description, image, ctaTitle, ctaLink } =
    content?.elements || {};
  const imageUrl =
    image?.value && image?.value.length > 0 ? image?.value[0].url : "";
  return (
    <div className="grid grid-cols-2 py-[3em]">
      <div className="mb-5">
        <h1 className="text-4xl mb-5">{title?.value}</h1>
        <p
          className="mb-5"
          dangerouslySetInnerHTML={{ __html: description?.value }}
        />
        {ctaTitle?.value && ctaLink?.value ? (
          <CTA title={ctaTitle.value} link={ctaLink.value} />
        ) : null}
      </div>
      {image ? (
        <div>
          <img src={imageUrl} width="500px" />
        </div>
      ) : null}
    </div>
  );
};

registerUniformComponent({
  type: "hero",
  component: Hero,
});
