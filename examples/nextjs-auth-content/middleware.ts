import { NextRequest, NextResponse } from 'next/server';
import { uniformMiddleware } from '@uniformdev/next-app-router/middleware';
import {
  buildQuirksFromUser,
  checkProtectedRouteAccess,
  getDisplayUserFromRequest,
} from './src/lib/auth/middleware-helpers';

export async function middleware(req: NextRequest) {
  // ---------------------------------------------------
  // USER SESSION AND PROTECTED ROUTES
  const user = await getDisplayUserFromRequest(req);
  const { canAccess, loginRedirectPath, headers } = await checkProtectedRouteAccess(req, user);
  if (!canAccess) {
    if (loginRedirectPath) {
      return NextResponse.redirect(new URL(loginRedirectPath, req.url), { headers });
    } else {
      return NextResponse.rewrite(new URL('/not-found', req.url), { status: 404 });
    }
  }

  // ---------------------------------------------------
  // UNIFORM MIDDLEWARE
  const quirks = buildQuirksFromUser(user);

  // Continue with Uniform middleware, passing quirks for personalization
  return uniformMiddleware({
    quirks,
    rewriteRequestPath: async ({ url }) => {
      return ({
        path: url.pathname,
        keys: {
          authenticated: quirks.authenticated,
        },
      })
    },
  })(req);
}

export const runtime = 'experimental-edge';

// Matcher to exclude static assets, API routes, and preview from middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes including /api/preview, /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - /-/media/ (Sitecore media)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
