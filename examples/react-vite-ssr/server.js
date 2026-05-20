import fs from "node:fs/promises";
import express from "express";
import cors from "cors";
import {
  isAllowedReferrer,
  EMPTY_COMPOSITION,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM,
} from "@uniformdev/canvas";
import { parseQuirkCookie, UNIFORM_DEFAULT_QUIRK_COOKIE_NAME } from "@uniformdev/context";

import { getComposition } from "./src/uniform/api.js";

// Pulls the visitor's quirks out of the request's `ufvdqk` cookie, written by
// the client-side CookieTransitionDataStore on every context.update({ quirks }).
// Returns an empty object on first visits (no cookie yet) — SSR then renders
// with default token values until the client hydrates and the next page-load
// gets the personalized SSR output.
function getRequestQuirks(req) {
  const header = req.headers.cookie ?? "";
  const pairs = header.split(";").map((s) => s.trim()).filter(Boolean);
  for (const pair of pairs) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const name = pair.slice(0, eq);
    if (name !== UNIFORM_DEFAULT_QUIRK_COOKIE_NAME) continue;
    return parseQuirkCookie(decodeURIComponent(pair.slice(eq + 1)));
  }
  return {};
}

// For now, we will use the same path we use to render composition.
// But it's recommended to have a dedicated route for the playground and use <UniformPlayground />
const PLAYGROUND_PATH = "/";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";

// Create http server
const app = express();
app.use(cors());

// Add Vite or respective production middlewares
/**
 * @type {import('vite').ViteDevServer}
 */
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
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
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

    const path = req.params[0];
    let composition;

    if (req.params[0] === "/api/preview" && isAllowedReferrer(req.headers.referer)) {
      // In preview mode, there is no need to spent time fetching the composition
      // we will get it from Canvas editor on the client-side. We just use a stub composition
      composition = EMPTY_COMPOSITION;
      // TODO: check if the preview secret is correct before moving forward
    } else {
      composition = await getComposition(path, getRequestQuirks(req));
    }

    const rendered = await render({ composition });

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(`<!--app-data-->`, rendered.dataScript ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
