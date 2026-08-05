import { uniformMiddleware } from "@uniformdev/next-app-router/middleware";

import { rewritePaginationDatasourcePath } from "./lib/paginationDatasource";

// Important: the list of locales can be retrieved from Uniform API for multi-lingual solutions
const locales = ["en"]; // example locales, adjust as needed

export default uniformMiddleware({
  // The visitor sees `/en/pagination-datasource/<page>`, but Uniform's project
  // map node is `:offset`-based (the data resource binds its offset variable
  // to that segment). Translate `page` → `offset` here so the SDK requests the
  // right slice. `url.search` is forwarded too, in case other parts of the app
  // use declared query strings.
  rewriteRequestPath: async ({ url }) => {
    const localised = formatPath(url.pathname, locales[0]);
    const rewritten = rewritePaginationDatasourcePath(localised);
    return { path: `${rewritten}${url.search}` };
  },
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
