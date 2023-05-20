import * as React from "react";
import {
  UniformText,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

type GenericCardProps = {
  title: string;
  text?: string | any;
  ctaLink?: string;
  ctaTitle?: string;
};

export const GenericCard = ({ ctaLink = "#" }: GenericCardProps) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <UniformText
        parameterId="title"
        as="h3"
        className="text-xl font-medium text-center mb-5"
      />
      <UniformText parameterId="text" as="p" className="px-10" />
      <a href={ctaLink}>
        <p className="text-center mt-5 text-[#c98686] font-semibold">
          <UniformText parameterId="ctaTitle" as="span" />
        </p>
      </a>
    </div>
  );
};

registerUniformComponent({
  type: "genericCard",
  component: GenericCard,
});
