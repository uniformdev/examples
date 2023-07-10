import { FC } from "react";
import { Grid } from "@mui/material";
import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";

const FacetsContainer: FC = () => (
  <Grid item xs={4}>
    <UniformSlot name="widgets" />
  </Grid>
);

registerUniformComponent({
  type: "coveo-facet-container",
  component: FacetsContainer,
});

export default FacetsContainer;
