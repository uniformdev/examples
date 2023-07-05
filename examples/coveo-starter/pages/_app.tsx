import React from "react";
import type { AppProps } from "next/app";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "../context/theme";
import "../styles/styles.css";


function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
