import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import {
  Context,
  CookieTransitionDataStore,
  ManifestV2,
  UNIFORM_DEFAULT_COOKIE_NAME,
} from "@uniformdev/context";
import { createUniformEdgeMiddleware } from "@uniformdev/context-edge-vercel";
import manifest from "./lib/uniform/context-manifest.json";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|images|img|api|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const data = request.headers.get("x-nextjs-data");
  const previewDataCookie = request.cookies.get("__next_preview_data");
  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  // disabling middleware in preview or locally
  if (
    Boolean(previewDataCookie) ||
    Boolean(data) ||
    params.is_incontext_editing_mode === "true" ||
    !process.env.VERCEL_URL
  ) {
    return NextResponse.next();
  }

  console.log("!!!!!!! Edge middleware processing request", { request });

  const serverCookieValue = request
    ? parse(request.headers.get("cookie") ?? "")[UNIFORM_DEFAULT_COOKIE_NAME]
    : undefined;

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue,
    }),
  });

  console.log("!!!!!!! Running edge middleware");

  const handler = createUniformEdgeMiddleware();

  const response = await handler({
    context,
    origin: new URL(request.url),
    request,
  });

  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

  console.log("!!!!!!! Returning edge middleware");

  return response;
}
