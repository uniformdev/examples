import { FC } from "react";
import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { Grid } from "@mui/material";

const SummaryContainer: FC = () => (
  <Grid container my={3} alignItems="center">
    <UniformSlot name="widgets" />
  </Grid>
);

registerUniformComponent({
  type: "coveo-summary-container",
  component: SummaryContainer,
});

export default SummaryContainer;
