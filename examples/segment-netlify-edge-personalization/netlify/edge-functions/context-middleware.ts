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
      "Cache-Control": "no-store, must-revalidate",
      "Content-Type": "text/html; charset=utf-8", // To apply automatic deno compression, more info https://deno.com/deploy/docs/compression
      Expires: "0",
    },
  });
};

async function getCDPData(netlifyContext: Context) {
  const ajs_anonymous_id = netlifyContext.cookies.get("ajs_anonymous_id");
  console.log({ visitorId: ajs_anonymous_id });
  if (!ajs_anonymous_id) {
    return {};
  }

  // @ts-ignore: deno imports failing next build
  const segmentSpaceId = Deno.env.get("SEGMENT_SPACE_ID");
  // @ts-ignore: deno imports failing next build
  const segmentBasicAuth = Deno.env.get("SEGMENT_BASIC_AUTH");

  const url = `https://profiles.segment.com/v1/spaces/${segmentSpaceId}/collections/users/profiles/anonymous_id:${ajs_anonymous_id}/traits`;

  const visitorResponse = await fetch(url, {
    headers: {
      Authorization: `Basic ${segmentBasicAuth}`,
    },
  });
  console.log({ visitorResponse });
  if (!visitorResponse.ok) {
    console.log("Error fetching CDP data");
    return {};
  }
  const visitorData = await visitorResponse.json();
  const traits = removeUnderscores(visitorData?.traits);
  console.log({ traits });
  return traits;
}

function shouldProcess(request: Request) {
  const IGNORED_PATHS = /\/.*\.(ico|png|jpg|jpeg|svg|css|js|json)(?:\?.*|$)$/g;
  return (
    request.method.toUpperCase() === "GET" || !request.url.match(IGNORED_PATHS)
  );
}

function removeUnderscores(obj: any) {
  return Object.keys(obj).reduce((accumulator: any, key) => {
    accumulator[key.replaceAll("_", "")] = obj[key];
    return accumulator;
  }, {});
}
