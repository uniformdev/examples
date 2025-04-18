import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de', 'ja'],

  // Used when no locale matches
  defaultLocale: 'en',
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
