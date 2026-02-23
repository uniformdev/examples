import {
  Context,
  CookieTransitionDataStore,
  UNIFORM_DEFAULT_COOKIE_NAME,
} from "@uniformdev/context";
import { createUniformNesiResponseHandler } from "@uniformdev/context-edge-sveltekit";
import { next } from "@vercel/functions";
import { parse } from "cookie";
import type { ManifestV2 } from "@uniformdev/context";
import manifestJson from "./src/lib/uniform/contextManifest.json";

const manifest = manifestJson as ManifestV2;

export default async function middleware(request: Request) {
  // ignore anything with this header, it is injected by this middleware for subrequests.
  if (request.headers.get("x-from-middleware") === "true") {
    return next(request);
  }

  // check to see if bypass token is present for sveltekit on vercel
  const bypassToken = request.headers.get("x-prerender-revalidate");
  const envBypassToken = process.env.BYPASS_TOKEN;
  if (bypassToken && envBypassToken && bypassToken === envBypassToken) {
    return next(request);
  }

  const url = new URL(request.url);

  const cookieValue = request.headers.get("cookie");
  const cookies = parse(cookieValue ?? "");

  const context = new Context({
    manifest: manifest as ManifestV2,
    defaultConsent: true,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: cookies[UNIFORM_DEFAULT_COOKIE_NAME] ?? undefined,
    }),
  });

  await context.update({
    cookies,
    url,
  });

  const response = await fetch(url, {
    headers: {
      "x-from-middleware": "true",
    },
  });

  const handler = createUniformNesiResponseHandler();
  const processedResponse = await handler({
    response,
    context,
  });

  return processedResponse;
}

// Match all paths except:
// - Static files (with extensions)
// - SvelteKit internal paths (_app, __data.json)
// - Vite development server paths (@vite, @id, @fs)
// - Build artifacts and assets
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _app (SvelteKit client-side routing)
     * - __data.json (SvelteKit data endpoints)
     * - @vite (Vite HMR client)
     * - @id (Vite virtual modules)
     * - @fs (Vite filesystem access)
     * - Static files (containing a dot)
     * - _next (if any Next.js artifacts exist)
     * - favicon.ico
     */
    "/((?!_app|__data\\.json|@vite|@id|@fs|_next|.*\\..*|favicon\\.ico).*)",
  ],
};
