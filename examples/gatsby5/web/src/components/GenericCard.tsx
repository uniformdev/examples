import * as React from "react";
import {
  UniformText,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

export type GenericCardProps = {
  title: string;
  text?: string | any;
  ctaLink?: string;
  ctaTitle?: string;
};

export const GenericCard = ({
  title,
  text,
  ctaTitle,
  ctaLink = "#",
}: GenericCardProps) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <h3 className="text-xl font-medium text-center mb-5">{title}</h3>
      <p className="px-10" dangerouslySetInnerHTML={{ __html: text }} />
      <a href={ctaLink}>
        <p className="text-center mt-5 text-[#c98686] font-semibold">
          {ctaTitle}
        </p>
      </a>
    </div>
  );
};

registerUniformComponent({
  type: "genericCard",
  component: GenericCard,
});
