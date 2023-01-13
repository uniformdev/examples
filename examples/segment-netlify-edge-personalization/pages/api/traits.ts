import { NextApiHandler } from "next";
import getConfig from "next/config";

const handleGet: NextApiHandler = async (req, res) => {
  const {
    serverRuntimeConfig: { segmentApiKey, segmentSpaceId },
  } = getConfig();

  if (!segmentApiKey || !segmentSpaceId) {
    return res
      .status(400)
      .json({ message: "Segment settings are not configured" });
  }

  const nextCookies = req.cookies;
  const ajs_anonymous_id = nextCookies.ajs_anonymous_id;

  if (!segmentApiKey || !segmentSpaceId) {
    return res.status(401).json({
      message:
        "Segment identification hasn't taken place. No ajs_anonymous_id set",
    });
  }

  const url = `https://profiles.segment.com/v1/spaces/${segmentSpaceId}/collections/users/profiles/anonymous_id:${ajs_anonymous_id}/traits`;

  const basicAuth = Buffer.from(segmentApiKey + ":").toString("base64");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });
    const json = await response.json();
    return res.status(200).json({
      traits: json.traits,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error,
    });
  }
};

const handler: NextApiHandler = async (req, res) => {
  const method = req.method?.toLocaleLowerCase();
  if (method === "get") {
    return handleGet(req, res);
  } else if (method === "post") {
    return res.status(400).json({ message: "Method not implemented" });
  }

  return res.status(400).json({ message: "Method not implemented" });
};

export default handler;
