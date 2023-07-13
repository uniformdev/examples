import { FC } from "react";
import { Box, Grid } from "@mui/material";
import {
  ComponentProps,
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";

type SectionTwoColumnsProps = ComponentProps<{
  leftContentWidth?: string;
  rightContentWidth?: string;
}>;

const SectionTwoColumns: FC<SectionTwoColumnsProps> = ({
  rightContentWidth,
  leftContentWidth,
}) => (
    <Box my={1}>
      <Grid container>
        <Grid item xs={Number(leftContentWidth) || 4}>
          <UniformSlot name="leftContent" />
        </Grid>
        <Grid item xs={Number(rightContentWidth) || 8}>
          <UniformSlot name="rightContent" />
        </Grid>
      </Grid>
    </Box>
);;

registerUniformComponent({
  type: "sectionTwoColumns",
  component: SectionTwoColumns,
});

export default SectionTwoColumns;
