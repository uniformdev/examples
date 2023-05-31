import * as React from "react";
import {
  UniformSlot,
  UniformText,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

export const GenericGrid = () => {
  return (
    <div className="border-t-2 py-[4em]">
      <UniformText
        parameterId="title"
        as="h3"
        className="text-3xl text-center mb-10 font-medium"
      />
      <div className="grid grid-cols-3 gap-5">
        <UniformSlot name="items" />
      </div>
    </div>
  );
};

registerUniformComponent({
  type: "genericGrid",
  component: GenericGrid,
});
