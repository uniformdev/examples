import { uniformMiddleware } from "@uniformdev/canvas-next-rsc-v2/middleware";

// TODO: in production, use locales from your internationalization setup and retrieve default local from Uniform at build time
const defaultLocale = "en";
const locales = ["en"];

// This is the middleware that will rewrite the request path to the default locale
export default uniformMiddleware({
  rewriteRequestPath: async ({ url }) => ({
    path: formatPath(url.pathname, defaultLocale),
  }),
});

// this is the easiest way to get the middleware working but it doesn't handle locale rewrite so you have to request the page with localhost:3000/en/...
// export default uniformMiddleware();

const formatPath = (path: string, locale?: string | null): string => {
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
export const runtime = 'experimental-edge';