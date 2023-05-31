import * as React from "react";
import { registerUniformComponent } from "@uniformdev/canvas-react";

export const GenericGrid = () => {
  return <h1>Generic Grid</h1>;
};

registerUniformComponent({
  type: "genericGrid",
  component: GenericGrid,
});
