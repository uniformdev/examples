import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

export async function render({ composition }) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App composition={composition} />
    </React.StrictMode>
  );
  const dataScript = `<script>window._uniformPreloadedComposition = ${JSON.stringify(composition)};</script>`;
  return { html, dataScript };
}
