/**
 * Uniform project credentials for the app's *browser* bundle.
 *
 * Normally leave these empty: the SSR server loads credentials from `.env`
 * (or real `UNIFORM_PROJECT_ID` / `UNIFORM_API_KEY` env vars) and hands the resolved
 * route to the browser via TransferState, so the browser never needs the API key.
 * Fill these in only if you need client-side route fetching (e.g. client-side
 * navigation to paths that were not server-rendered) — and then use a read-only key
 * with only "Canvas > Read published" permissions, as the value ships in the browser
 * bundle.
 *
 * With neither this nor `.env` configured, the app runs in local demo mode (bundled
 * sample composition).
 */
export const environment = {
  uniformProjectId: '',
  uniformApiKey: '',
};
