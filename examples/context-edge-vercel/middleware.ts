import { NextRequest, NextResponse } from "next/server";
import {
  Context,
  CookieTransitionDataStore,
  ManifestV2,
} from "@uniformdev/context";
import { createUniformEdgeMiddleware } from "@uniformdev/context-edge-vercel";
import manifest from "./lib/uniform/context-manifest.json";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const data = request.headers.get("x-nextjs-data");
  if (
    path.startsWith("/images") ||
    path.startsWith("/_next") ||
    Boolean(data)
  ) {
    return NextResponse.next();
  }

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: request.headers.get("cookie") || "",
    }),
  });

  const handler = createUniformEdgeMiddleware();

  const response = await handler({
    context,
    origin: new URL(request.url),
    request,
  });

  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return response;
}
