import { registerUniformComponent } from "@uniformdev/canvas-react";
import * as React from "react";

export const GenericCard = ({
  content,
}: {
  content: {
    title: string;
    ctaLink?: string;
    ctaTitle?: string;
    body?: string | any;
  };
}) => {
  const { title, ctaLink = "#", ctaTitle, body } = content || {};
  return (
    <div className="h-full flex flex-col justify-between">
      <h3 className="text-xl font-medium text-center mb-5">{title}</h3>
      <p className="px-10">{body}</p>
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
