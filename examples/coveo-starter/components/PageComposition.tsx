import { FC } from "react";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Footer from "@/components/Footer";
import { theme } from "../context/theme";

export interface PageCompositionProps {
  data: RootComponentInstance;
}

const PageComposition: FC<PageCompositionProps> = ({ data: composition }) => (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <Box my={3}>
            <Typography
                align="center"
                color="text.primary"
                variant="h2"
                component="h2"
                gutterBottom
            >
              Coveo Headless Starter
            </Typography>
          </Box>
          <UniformComposition
              data={composition}
          >
            <UniformSlot name="search-content" />
          </UniformComposition>
          <Footer />
        </Container>
      </ThemeProvider>
    </CssBaseline>
);

export default PageComposition;
