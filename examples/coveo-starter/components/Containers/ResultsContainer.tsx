import { FC } from "react";
import { Grid } from "@mui/material";
import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";

const ResultsContainer: FC = () => (
  <Grid item xs={8}>
    <UniformSlot name="widgets" />
  </Grid>
);

registerUniformComponent({
  type: "coveo-results-container",
  component: ResultsContainer,
});

export default ResultsContainer;
