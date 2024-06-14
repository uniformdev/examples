/**
 * Define a polyfill for 'process'
 */
global.process = global.process || { env: {} };

/**
 * Sets environment variables from a given context.
 *
 * @param {Object} context - The context object containing environment variables.
 * @param {Object} context.environmentVars - Key-value pairs of environment variables.
 */
export function setEnvFromContext({ environmentVars }) {
  Object.assign(process.env, environmentVars);
}

export async function handleHttpRequest(request, context) {
  setEnvFromContext(context);
  const origin = new URL(request.url);
  const endpoint = process.env.UNIFORM_INSIGHTS_ENDPOINT;
  const apiKey = process.env.UNIFORM_INSIGHTS_KEY;

  if (!endpoint || !apiKey) {
    return new Response("Uniform Insights: missing environment variables", {
      status: 500,
    });
  }

  const destination = `${endpoint}/v0/events/${origin.search}&name=analytics_events`;
  const response = await fetch(destination, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    edgio: { origin: "edgio_serverless" },
  });
  return response;
}
