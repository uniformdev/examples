// @see https://docs.edg.io/rest_api/#tag/purge-requests/operation/postCacheV01PurgeRequests
export const purgeEdgioCache = async (values?: string[]) => {
  const accessTokenRes = await fetch('https://id.edgio.app/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.EDGIO_CLIENT_ID,
      client_secret: process.env.EDGIO_CLIENT_SECRET,
    }),
  });

  const accessToken = (await accessTokenRes.json()).access_token;

  const res = await fetch('https://edgioapis.com/cache/v0.1/purge-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      environment_id: process.env.EDGIO_ENVIRONMENT_ID,
      purge_type: values?.length ? 'path' : "all_entries",
      values,
    }),
  });

  if (!res.ok) {
    const errorJson = await res.json()
    throw new Error(`Failed to purge cache: ${res.status} - ${JSON.stringify(errorJson)}`);
  }
}
