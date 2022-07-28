import { createResponse } from 'create-response';
import { createAkamaiEdgeContext, createAkamaiProxyEdgeHandler } from '@uniformdev/context-edge-akamai';
import { httpRequest } from 'http-request';
import { ManifestV2 } from '@uniformdev/context';
import manifestJson from './manifest/current.json';

/**
 * You must specify a value for the variable "source".
 * This value determines how the worker resolves the
 * Uniform manifest. The following values can be used:
 * 
 * OPTION 1: bundle (DEFAULT)
 * You make the manifest available as a local resource by
 * downloading it during the build process. Doing this
 * means that you must rebuild and deploy the EdgeWorker
 * after any change to the manifest.
 *
 * OPTION 2: request
 * You can deploy the manifest to the origin and have the
 * EdgeWorker read the manifest from there. This allows
 * you to make deploy changes to the manifest without 
 * having to rebuild and deploy the EdgeWorker. 
 * 
 * If you use this option you must also do the following:
 * 1. Include the manifest as a static file (like an image)
 *    when you deploy your application. For example, if you
 *    are using Next.js, you would add the manifest file to
 *    the folder "public".
 * 2. In the worker, set the variable "url" to the URL.
 */
let source = "request";
const url = "/contextManifest.json";
 
async function getManifest(): Promise<ManifestV2> {
  if (source === "request") {
    const response = await httpRequest(url);
    if (!response.ok) {
      throw new Error(`Failed to get context manifest from ${url}`);
    }
    const manifest = await response.json();
    return manifest;
  }
  if (source === "bundle") {
    const manifest: ManifestV2 = <ManifestV2>manifestJson;
    return manifest;
  }
  throw new Error(`Unsupported manifest source value ${source}`);
}

export async function responseProvider(request: EW.ResponseProviderRequest & EW.ReadsVariables) {
  try {
    
    /**
     * How the manifest is read based on environment variables.
     */
    const manifest = await getManifest();

    /**
     * Since personalization instructions are going 
     * to run in the EdgeWorker, a context object is
     * needed. This basically provides state data to
     * the personalization process.
     */
    const context = createAkamaiEdgeContext({ request, manifest });

    /**
     * The proxy handler makes the request to the origin
     * and it executes the personalization instructions.
     */
    const handler = createAkamaiProxyEdgeHandler();

    /**
     * This runs the proxy handler, passing it the 
     * relevant context and other information so it
     * can execute the personalization instructions.
     */
    const { processed, response } = await handler({
      context,
      request,
      /**
       * You can set quirks from request objects that
       * Akamai makes available to your EdgeWorker at
       * runtime.
       */
      quirks: {
        userLocation: ["city", "country"],
        device: ["isMobile"],
      }
    });

    /**
     * Add headers to the response. These are not required but
     * they can help with debugging. These headers provide
     * information about the original request and the result
     * of the EdgeWorker running.
     */
    const headers = response.headers;
    headers['x-rp-request-scheme'] = [request.scheme];
    headers['x-rp-request-host'] = [request.host];
    headers['x-rp-request-url'] = [request.url];
    headers['x-rp-processed'] = [String(processed)];
    headers['x-rp-status'] = [String(response.status)];
    headers['x-rp-timestamp'] = [String(new Date().getTime())];
    
    /**
     * Return a new response based on the response
     * from the proxy handler.
     */
    return createResponse(response.status, response.headers, response.body);
  } catch (e) {
    /**
     * If an error happens, return details in the response.
     */
    return createResponse(JSON.stringify(e, Object.getOwnPropertyNames(e)));
  }
}
