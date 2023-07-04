import React from "react";
import type { AppProps } from "next/app";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "../context/theme";
import "../styles/styles.css";


function App({ Component, pageProps }: AppProps) {
  return <CssBaseline>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </CssBaseline>;
}

export default App;
