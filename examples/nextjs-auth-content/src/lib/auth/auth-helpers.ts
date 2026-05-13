import type { User } from 'better-auth';

export const RETURN_URL_SEARCH_PARAM = 'returnUrl';

/**
 * The user properties with additional fields
 */
export interface DisplayUser extends User {
  id: string;
  group?: string;
}

export function getDecodedString(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

export function getDecodedBoolean(val: unknown): boolean {
  return typeof val === 'boolean' ? val : typeof val === 'string' ? val === 'true' : false;
}

const EXCLUDED_URLS = ['/login', '/logout'];

export function isValidCallbackURL(url: string | null | undefined): url is string {
  if (typeof url !== 'string') {
    return false;
  }
  if (EXCLUDED_URLS.some(exclude => url.endsWith(exclude))) {
    return false;
  }
  // Must start with "/" but not "//" (protocol-relative URL)
  if (!/^\/[^/]/.test(url) && url !== '/') {
    return false;
  }
  return true;
}

export const resolveCallbackURL = (searchParams = new URLSearchParams(window.location.search)): string => {
  const returnUrl = searchParams.get(RETURN_URL_SEARCH_PARAM);
  if (isValidCallbackURL(returnUrl)) {
    return returnUrl;
  } else {
    const pathname = window.location.pathname;
    return isValidCallbackURL(pathname) ? pathname : '/';
  }
};
