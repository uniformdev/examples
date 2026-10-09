import { vercelUniformEdgeMiddleware } from "@uniformdev/next-app-router/vercel";

// Important: the list of locales can be retrieved from Uniform API for multi-lingual solutions
const locales = ["en"]; // example locales, adjust as needed

// Edge mode: every visitor of a route shares one cached page, and the middleware keeps
// the visitor's personalization and test variants as the page streams through.
export default vercelUniformEdgeMiddleware({
  // since the default locale in the starter is 'en', in order for the app to respond on locale-less path, we add this rewrite
  rewriteRequestPath: async ({ url }) => ({
    path: formatPath(url.pathname, locales[0]),
  }),
  // Default SDK rewrite is /uniform/playground/<code>; this app uses /playground/[code].
  // Canvas still hits /uniform/playground; only the internal rewrite target changes.
  rewriteDestinationPath: async ({ code, source }) =>
    source === "playground" ? `/playground/${code}` : "",
});

export const formatPath = (path: string, locale?: string | null): string => {
  if (!locale) return path;
  if (isLocaleInPath(path)) return path;
  return `/${locale}${path}`;
};

const isLocaleInPath = (path: string): boolean => {
  const [firstSegment] = path.split("/").filter(Boolean);
  return firstSegment
    ? (locales as string[]).some((locale) => locale === firstSegment)
    : false;
};

// IMPORTANT: keep this file as middleware.ts on the edge runtime. Do not rename it to proxy.ts:
// there the SDK cannot read draft mode, so Uniform preview breaks on Vercel (vercel/next.js#82344).
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      // The middleware's own fetch of the cached page carries this header. Skip it.
      missing: [{ type: "header", key: "x-uniform-edge-origin" }],
    },
  ],
  runtime: "experimental-edge",
};
