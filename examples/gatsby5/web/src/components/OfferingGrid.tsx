import {
  UniformSlot,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import * as React from "react";

export const OfferingGrid = ({ title }: { title: string }) => {
  return (
    <div className="border-t-2 py-[4em]">
      <h3 className="text-3xl text-center mb-10 font-medium">{title}</h3>
      <div className="grid grid-cols-4 gap-7">
        <UniformSlot name="offerings" />
      </div>
    </div>
  );
};

registerUniformComponent({
  type: "offeringGrid",
  component: OfferingGrid,
});
