import { FC } from "react";
import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { Grid } from "@mui/material";

const CoveoContainer: FC = () => (
  <Grid container>
    <UniformSlot name="widgets" />
  </Grid>
);

registerUniformComponent({
  type: "coveo-container",
  component: CoveoContainer,
});

export default CoveoContainer;
