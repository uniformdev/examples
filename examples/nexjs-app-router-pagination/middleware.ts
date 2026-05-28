import { uniformMiddleware } from "@uniformdev/next-app-router/middleware";

// Important: the list of locales can be retrieved from Uniform API for multi-lingual solutions
const locales = ["en"]; // example locales, adjust as needed

export default uniformMiddleware({
  // since the default locale in the starter is 'en', in order for the app to respond on locale-less path, we add this rewrite
  // IMPORTANT: include url.search so query strings declared on the project map
  // node (see /en/pagination-datasource) survive into the Route API call and
  // come back as `context.dynamicInputs`. Without this, the SDK sees only the
  // pathname and the query is silently stripped.
  rewriteRequestPath: async ({ url }) => ({
    path: `${formatPath(url.pathname, locales[0])}${url.search}`,
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

// IMPORTANT: This is required for the middleware to work correctly for preview in Next.js 16
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "experimental-edge",
};
