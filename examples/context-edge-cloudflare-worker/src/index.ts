import { ManifestV2 } from '@uniformdev/context'
import { createEdgeContext } from '@uniformdev/context-edge'
import { createCloudflareProxyEdgeHandler } from './cloudflareHandler'

import manifest from './uniform/context-manifest.json'

export interface Env {
  ORIGIN_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.ORIGIN_URL) {
      console.error('ORIGIN_URL env var is not defined')
      return new Response(
        'Configuration Error: ORIGIN_URL env var is not defined',
        {
          status: 400,
        },
      )
    }

    if (!env.ORIGIN_URL.startsWith('https://')) {
      console.error('ORIGIN_URL env var is malformed, must start with https://')
      return new Response(
        'Configuration Error: ORIGIN_URL env var is malformed, must start with https://',
        {
          status: 400,
        },
      )
    }

    const url = new URL(request.url)
    const pathname = url.pathname
    const search = url.search
    const pathWithParams = pathname + search

    // Ignore any processing for non-page requests, proxy straight through
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.indexOf('.') > -1
    ) {
      return fetch(`${env.ORIGIN_URL}${pathWithParams}`)
    }

    const handler = createCloudflareProxyEdgeHandler()
    const context = createEdgeContext({
      request,
      manifest: manifest as ManifestV2,
    })
    const originUrl = buildOriginRequestUrl(request, env.ORIGIN_URL)
    const { response } = await handler({
      context,
      request,
      originUrl,
    })
    return response
  },
}

const buildOriginRequestUrl = (request: Request, originUrl: string): URL => {
  const origin = new URL(originUrl)
  const url = new URL(request.url)
  url.hostname = origin.hostname
  url.protocol = origin.protocol
  url.port = origin.port
  return url
}
