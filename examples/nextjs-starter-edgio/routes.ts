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
        __prerender_bypass: /.+/g,
        __next_preview_data: /.+/g,
      },
    },
    {
      caching: {
        bypass_cache: true,
        bypass_client_cache: true,
      },
    }
  );
