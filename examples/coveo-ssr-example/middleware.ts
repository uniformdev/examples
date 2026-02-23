import { uniformMiddleware } from "@uniformdev/next-app-router/middleware";

export default uniformMiddleware();

// IMPORTANT: This is required for the middleware to work correctly for preview in Next.js 16
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "experimental-edge",
};
