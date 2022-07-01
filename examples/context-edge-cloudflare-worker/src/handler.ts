import { createEdgeContext } from '@uniformdev/context-edge'
import { createCloudflareProxyEdgeHandler } from '@uniformdev/context-edge-cloudflare'
import { ManifestV2 } from '@uniformdev/context'
import manifest from "./uniform/context-manifest.json";

export async function handleRequest(request: Request): Promise<Response> {
  //@ts-ignore
  if (!ORIGIN_URL) {
    console.error('ORIGIN_URL environment is not defined')
    return new Response('Configuration Error', {
      status: 500,
    })
  }

  const handler = createCloudflareProxyEdgeHandler()

  const context = createEdgeContext({
    request,
    manifest: manifest as ManifestV2,
  })

  const { response } = await handler({
    context,
    request,
    //@ts-ignore
    originUrl: new URL(`https://${ORIGIN_URL}`).origin,
  })

  return response
}
