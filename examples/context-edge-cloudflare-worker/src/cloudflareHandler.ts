import { parse } from 'cookie'
import { Context } from '@uniformdev/context'
import { createEdgeHandler } from '@uniformdev/context-edge'

export const createCloudflareProxyEdgeHandler = () => {
  return async ({
    request,
    context,
    originUrl,
    missingQuirkValue = 'unknown',
    // CF updated their geoIP typings such that this is valid,
    // but can't be made type-safe due to weird union with any object.
    quirks = ['country', 'city', 'postalCode', 'region'] as any,
  }: {
    request: Request
    context: Context
    originUrl: URL
    missingQuirkValue?: string
    quirks?: (keyof IncomingRequestCfProperties)[]
  }) => {
    await context.update({
      cookies: parse(request.headers.get('cookie') || ''),
      url: new URL(request.url),
      quirks: quirks.reduce((previous, current) => {
        return {
          ...previous,
          [`cf-${current}`]:
            request.cf?.[current]?.toString() || missingQuirkValue,
        }
      }, {}),
    })

    const originResponse = await fetch(originUrl.toString(), {
      ...request,
      cf: {
        // IMPORTANT: set origin cache TTL to 30 seconds
        cacheTtl: 30,
      },
    })

    const handler = createEdgeHandler()

    const handlerResponse = await handler({
      context,
      response: originResponse,
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
    })

    return handlerResponse
  }
}
