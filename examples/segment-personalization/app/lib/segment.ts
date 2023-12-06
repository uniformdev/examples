export async function fetchTraits(anonymousId: string) {
  const segmentSpaceId = process.env.SEGMENT_SPACE_ID!;
  const segmentApiKey = process.env.SEGMENT_API_KEY!;
  const url = `https://profiles.segment.com/v1/spaces/${segmentSpaceId}/collections/users/profiles/anonymous_id:${anonymousId}/traits`;
  const basicAuth = Buffer.from(segmentApiKey + ":").toString("base64");
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Accept-Encoding": "gzip",
    },
  });
  return await response.json();
}
