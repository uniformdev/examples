import { retrieveRoute as uniformRetrieveRoute } from '@uniformdev/canvas-next-rsc';
import i18n from './locales.json';

const formatPath = (path?: string | string[], locale?: string | null) => {
  if (!locale) return path;
  if (!path) {
    return locale;
  }
  if (Array.isArray(path)) {
    const isLocaleInPath = path?.some(p => (i18n.locales as string[]).includes(p));
    if (isLocaleInPath) {
      return path;
    }
    return [locale, ...path];
  }

  const isLocaleInPath = (i18n.locales as string[])?.some(locale => path.includes(locale));
  if (isLocaleInPath) {
    return path;
  }

  return `${locale}/${path}`;
};

const retrieveRoute = async (props: Parameters<typeof uniformRetrieveRoute>[0], locale?: string | null) => {
  const path = props.params?.path;
  const updatedParams = {
    ...props.params,
    path: formatPath(path, locale),
  };
  return uniformRetrieveRoute({
    ...props,
    params: updatedParams,
  });
};

export default retrieveRoute;
