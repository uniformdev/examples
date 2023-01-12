import { Slot } from "@uniformdev/canvas-react";
import * as React from "react";
type HeroProps = {
  title: string;
  description: string;
  image: string;
  children?: any;
};

export const Hero = ({ title, description, image, children }: HeroProps) => {
  return (
    <div className="grid grid-cols-2 py-[3em]">
      <div className="mb-5">
        <h1 className="text-4xl mb-5">{title}</h1>
        <p className="mb-5">{description}</p>
        <div>
          <Slot name="ctas" />
        </div>
      </div>
      <div>
        <img src={image} width="500px" />
      </div>
    </div>
  );
};
