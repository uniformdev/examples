// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from "@edgio/core/router";
import { nextRoutes } from "@edgio/next";

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)
  .match("/(.*)", {
    caching: {
      cache_key: { include_cookies: ["ufvd"], include_all_query_params: true },
    },
  }) // Disable caching for preview mode
  .match(
    {
      cookies: {
        __prerender_bypass: /.*/g,
        __next_preview_data: /.*/g,
      },
    },
    {
      caching: {
        bypass_cache: true,
        bypass_client_cache: true,
      },
    }
  )
  .post("/v0/events", {
    origin: {
      set_origin: "insights",
    },
    headers: {
      set_request_headers: {
        Authorization: `Bearer ${process.env.UNIFORM_INSIGHTS_KEY}`,
      },
    },
  });
// .match("/v0/events", {
//   edge_function: "./edge-functions/insightsRewriter.js",
// });
