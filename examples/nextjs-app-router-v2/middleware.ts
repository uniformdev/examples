import { uniformMiddleware } from "@uniformdev/canvas-next-rsc-v2/middleware";

export default uniformMiddleware();

// IMPORTANT: This is required for the middleware to work correctly for preview in Next.js 16
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "experimental-edge",
};
