import { FC } from "react";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
        <UniformComposition data={composition}>
          <UniformSlot name="search-content" />
        </UniformComposition>
        <Footer />
      </Container>
    </ThemeProvider>
  </CssBaseline>
);

export default PageComposition;
