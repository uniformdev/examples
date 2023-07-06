import { FC } from "react";
import { Grid } from "@mui/material";
import { UniformSlot } from "@uniformdev/canvas-react";
import componentResolver from "@/components/componentResolver";

const FacetsContainer: FC = () => (
  <Grid item xs={4}>
    <UniformSlot name="widgets" resolveRenderer={componentResolver} />
  </Grid>
);

export default FacetsContainer;
