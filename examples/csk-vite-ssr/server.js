import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import {
  isAllowedReferrer,
  EMPTY_COMPOSITION,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM,
} from "@uniformdev/canvas";
import { getComposition } from "./src/uniform/api.js";
import "dotenv/config";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";

// Create http server
const app = express();
app.use(cors());

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const isConfigCheck = req.query[IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM] === "true";
    if (isConfigCheck) {
      res.json({
        hasPlayground: Boolean(PLAYGROUND_PATH),
      });
      return;
    }

    const path = req.params.all.join("/");
    let composition;

    if (path === "/api/preview" && isAllowedReferrer(req.headers.referer)) {
      // In preview mode, there is no need to spent time fetching the composition
      // we will get it from Canvas editor on the client-side. We just use a stub composition
      composition = EMPTY_COMPOSITION;
      // TODO: check if the preview secret is correct before moving forward
    } else {
      composition = await getComposition(path);
    }

    const rendered = await render({ composition });

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.info(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.info(`Server started at http://localhost:${port}`);
});
