import { FC } from "react";
import componentResolver from "@/components/componentResolver";
import { UniformSlot } from "@uniformdev/canvas-react";
import { Box } from "@mui/material";

const InitialContainer: FC = () => (
  <Box my={1}>
    <UniformSlot name="widgets" resolveRenderer={componentResolver} />
  </Box>
);

export default InitialContainer;
