// import i18n from '@/i18n/locales.json';
const i18n = {
  locales: ['en'],
  localeNames: {
    en: 'English',
  },
  localeGroups: {
    en: '',
  },
  defaultLocale: 'en',
};

/**
 * Removes the locale prefix from a given path if present.
 *
 * @param {string} path - The URL path to modify (e.g. "/en/about", "/fr/contact", "/about").
 * @returns {string} The path with the locale prefix removed, or the original path if no locale prefix is found.
 */
export const removeLocaleFromPath = (path: string): string => {
  const [firstSegment, ...restSegments] = path.split('/').filter(Boolean);
  const uniformLocales = i18n.locales.map(locale => locale.toLowerCase());
  if (firstSegment && [':locale', ...uniformLocales].includes(firstSegment)) {
    return '/' + restSegments.join('/');
  }
  // keep leading slash even if no locale
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  return path;
};
