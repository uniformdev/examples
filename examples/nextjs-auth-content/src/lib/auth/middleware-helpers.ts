import { NextRequest } from 'next/server';
import { auth } from '../auth';
import { DisplayUser } from './auth-helpers';
import { isProtectedPathAllowedForUser } from './protected-routes';

/**
 * Resolve the display user from a request
 */
export async function getDisplayUserFromRequest(req: NextRequest): Promise<DisplayUser | undefined> {
  // Check if this is a preview/canvas editing request - skip auth for these
  const hasPreviewSecret = req.nextUrl.searchParams.get('secret') === process.env.UNIFORM_PREVIEW_SECRET;
  const hasDraftCookie = req.cookies.get('__prerender_bypass');
  const isPreviewSecure = hasPreviewSecret || hasDraftCookie;
  const isPreviewAuthenticated = isPreviewSecure && req.nextUrl.searchParams.get('is_authenticated_editing_mode') === 'true';
  const isPreviewMode = isPreviewSecure && req.nextUrl.searchParams.get('is_incontext_editing_mode') === 'true';

  let user: DisplayUser | undefined;

  // Skip auth session check for preview/canvas editing to avoid cross-origin issues
  if (isPreviewMode && isPreviewSecure) {
    if (isPreviewAuthenticated) {
      console.info('Middleware: Preview authorized mode, using mock user');
      user = {
        id: 'preview-user',
        name: 'Preview User',
        email: '',
        image: '',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } else {
      console.info('Middleware: Skipping auth for preview mode');
    }
  }else {
    try {
      // Get the session from Better Auth
      const session = await auth.api.getSession({
        headers: req.headers,
      });
      user = session?.user as DisplayUser | undefined;
    } catch (error) {
      // Session check failed - continue without user context
      console.info('Middleware: Session check failed, continuing without auth', error);
    }
  }

  return user;
}

/**
 * Check whether the current user can access the given route.
 *
 * This will depend on:
 *
 * 1. whether the route is protected
 * 2. the user's authentication status
 * 3. are we in the canvas editor
 */
export async function checkProtectedRouteAccess(req: NextRequest, user: DisplayUser | undefined) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  /**
   * CANVAS EDITOR BYPASS
   * Allow Uniform Canvas to access protected routes for editing/preview
   * without authentication. This is necessary for content authors to edit
   * protected content in the Canvas editor.
   *
   * SECURITY CHECKS (any of these conditions grants access):
   *
   * 1. Draft Mode Cookie: Set by /api/preview route when Canvas initializes
   *    This is the most secure method as cookies are HTTP-only
   *
   * 2. Canvas + Secret: Both is_incontext_editing_mode=true AND valid secret
   *    Used when initially loading Canvas or navigating with query params
   *
   * Why multiple checks?
   * - When navigating between pages in Canvas, query params might not persist
   * - Draft mode cookie persists across navigation
   * - This ensures smooth editing experience without security compromise
   */
  const isCanvasEditing = searchParams.get('is_incontext_editing_mode') === 'true';
  const hasPreviewSecret = searchParams.get('secret') === process.env.UNIFORM_PREVIEW_SECRET;

  // Check for Next.js draft mode cookie (set by /api/preview)
  const draftModeCookie = req.cookies.get('__prerender_bypass');
  const hasDraftMode = !!draftModeCookie;

  // Allow access if:
  // 1. Draft mode is enabled (most secure - set by preview API)
  // 2. OR both Canvas editing flag AND valid secret are present
  if (hasDraftMode || (isCanvasEditing && hasPreviewSecret)) {
    // Allow Canvas editor to access all routes
    return { canAccess: true };
  }

  /**
   * ROUTE-LEVEL PROTECTION
   *
   * This is enforced at the proxy level (before page code runs).
   *
   * The protectedRoutes ALWAYS require authentication. If they also specify
   * a list of member roles, the user will also need to be in a group that is listed.
   *
   * Note: This takes precedence over component-level access control.
   */
  const isPathAllowed = await isProtectedPathAllowedForUser(pathname, user);

  // Redirect to sign in page if the path is not allowed
  if (!isPathAllowed) {
    if (user) {
      return {
        canAccess: false,
        notFound: true,
      };
    } else {
      const { headers, response } = await auth.api.signInSocial({
        returnHeaders: true,
        headers: req.headers,
        body: {
          provider: 'google',
          callbackURL: pathname,
        },
      });
      return {
        canAccess: false,
        headers,
        loginRedirectPath: response.url,
      };
    }
  }

  /**
   * PUBLIC ROUTES
   *
   * All other routes are public by default at the middleware level.
   * However, individual pages on /cms/* routes can still enforce
   * authentication using composition-level accessType parameters.
   */
  return { canAccess: true };
}

/**
 * Build an object of quirks to pass to Uniform Context
 */
export function buildQuirksFromUser(user: DisplayUser | null | undefined) {
  return {
    authenticated: String(!!user),
    email: String(user?.email ?? ''),
    name: String(user?.name ?? ''),
  };
}
