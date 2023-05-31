import * as React from "react";
import { registerUniformComponent } from "@uniformdev/canvas-react";

export const OfferingGrid = () => {
  return <h1>Offering Grid</h1>;
};

registerUniformComponent({
  type: "offeringGrid",
  component: OfferingGrid,
});
