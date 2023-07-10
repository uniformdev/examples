import { FC } from "react";
import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { Box } from "@mui/material";

const InitialContainer: FC = () => (
  <Box my={1}>
    <UniformSlot name="widgets" />
  </Box>
);

registerUniformComponent({
  type: "coveo-initial",
  component: InitialContainer,
});

export default InitialContainer;
