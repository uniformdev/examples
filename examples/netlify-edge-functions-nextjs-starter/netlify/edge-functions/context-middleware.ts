import manifest from "../../lib/uniform/contextManifest.json" assert { type: "json" };
import {
  createEdgeContext,
  createUniformEdgeHandler,
  buildNetlifyQuirks,
} from "../../lib/uniform/index.deno.js";
// @ts-ignore: deno imports failing next build
import type { Context } from "netlify:edge";

export default async (request: Request, netlifyContext: Context) => {
  // ignoring requests that are not pages
  if (!shouldProcess) {
    return await netlifyContext.next({ sendConditionalRequest: true });
  }

  const context = createEdgeContext({
    manifest: manifest,
    request,
  });
  const originResponse = await netlifyContext.next();
  const handler = createUniformEdgeHandler();
  const quirks = {
    ...buildNetlifyQuirks(netlifyContext),
    ...(await getCDPData(netlifyContext)),
  };
  console.log({ quirks });
  const { processed, response } = await handler({
    context,
    request,
    response: originResponse,
    quirks,
  });

  if (!processed) {
    return response;
  }

  return new Response(response.body, {
    ...response,
    headers: {
      // ...response.headers, Symbol cannot be destructured
      'Cache-Control': 'no-store, must-revalidate',
      'Content-Type': 'text/html; charset=utf-8', // To apply automatic deno compression, more info https://deno.com/deploy/docs/compression
      Expires: '0',
    },
  });
};

async function getCDPData(netlifyContext: Context) {
  const vid = netlifyContext.cookies.get("vid");
  console.log({ visitorId: vid });
  if (!vid) {
    return {};
  }
  const visitorResponse = await fetch(
    `https://cdpmock.netlify.app/profile/v1/spaces/space_1/collections/users/profiles/user_id:${vid}/traits`
  );
  if (!visitorResponse.ok) {
    console.log("Error fetching CDP data");
  }
  const visitorData = await visitorResponse.json();
  console.log({ visitorData });
  return visitorData?.traits;
}

function shouldProcess(request: Request) {
  const IGNORED_PATHS = /\/.*\.(ico|png|jpg|jpeg|svg|css|js|json)(?:\?.*|$)$/g;
  return (
    request.method.toUpperCase() === "GET" || !request.url.match(IGNORED_PATHS)
  );
}
