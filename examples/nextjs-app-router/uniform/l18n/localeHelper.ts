import { retrieveRoute as uniformRetrieveRoute } from '@uniformdev/canvas-next-rsc';

// Using hard-coded locales as a simple example
// you can retrieve them from Uniform dynamically if needed
import i18n from './locales.json';

const locales = i18n.locales as string[];

function isLocaleInPath(path: string | string[]): boolean {
  const segments = Array.isArray(path) ? path : [path];
  return segments.some(segment => locales.includes(segment));
}

function formatPath(path?: string | string[], locale?: string | null): string | string[] | undefined {
  // If no locale is provided, just return the original path.
  if (!locale) return path;

  // If path is not defined, use the locale directly.
  if (!path) return locale;

  // If path already includes a recognized locale, return it as is.
  if (isLocaleInPath(path)) return path;

  // If path doesn't include a locale:
  // - For arrays, prepend the locale.
  // - For strings, concatenate the locale with '/'.
  return Array.isArray(path) ? [locale, ...path] : `${locale}/${path}`;
}

const retrieveRoute = async (props: Parameters<typeof uniformRetrieveRoute>[0], locale?: string | null) => {
  const params = await props.params;
  const updatedParams = getUpdatedParams(params, locale);
  return uniformRetrieveRoute({
    ...props,
    params: updatedParams,
  });
};

async function getUpdatedParams(params: { path?: string | string[] } | undefined, locale: string | null | undefined) {
  return Promise.resolve({
    ...params,
    path: formatPath(params?.path, locale),
  });
}

export default retrieveRoute;