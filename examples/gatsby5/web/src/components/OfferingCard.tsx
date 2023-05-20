import * as React from "react";
import {
  UniformText,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

type OfferingCardProps = {
  name: string;
  summary?: string | any;
  image?: string;
};

export const OfferingCard = ({ image }: OfferingCardProps) => {
  return (
    <div className="text-center rounded-md border-2 p-3 h-full flex flex-col justify-between">
      <UniformText
        parameterId="name"
        as="h4"
        className="text-lg font-semibold"
      />
      <div className="min-h-150">
        <img src={image} width="100px" className="mx-auto" height={300} />
      </div>
      <UniformText parameterId="summary" as="p" className="text-sm" />
    </div>
  );
};

registerUniformComponent({
  type: "offeringCard",
  component: OfferingCard,
});
