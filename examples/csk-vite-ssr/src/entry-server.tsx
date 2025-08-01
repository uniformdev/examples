import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { RootComponentInstance } from "@uniformdev/canvas";
import App from "./App";

export async function render({ composition }: { composition: RootComponentInstance }) {
  const html = renderToString(
    <StrictMode>
      <App composition={composition} />
    </StrictMode>
  );
  return { html };
}
