import { Context } from '@uniformdev/context';
import { createEdgeHandler } from '@uniformdev/context-edge';
import { parse } from 'cookie';

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
		request: Request;
		context: Context;
		originUrl: URL;
		missingQuirkValue?: string;
		quirks?: (keyof IncomingRequestCfProperties)[];
	}) => {
		await context.update({
			cookies: parse(request.headers.get('cookie') || ''),
			url: new URL(request.url),
			quirks: quirks.reduce((previous, current) => {
				return {
					...previous,
					[`cf-${current}`]: request.cf?.[current]?.toString() || missingQuirkValue,
				};
			}, {}),
		});

		const originResponse = await fetch(originUrl.toString(), {
			...request,
			cf: {
				// IMPORTANT: set cache ttl to zero
				cacheTtl: 0,
			},
		});

		const handler = createEdgeHandler();

		const handlerResponse = await handler({
			context,
			response: originResponse,
			encoder: new TextEncoder(),
			decoder: new TextDecoder(),
		});

		return handlerResponse;
	};
};
