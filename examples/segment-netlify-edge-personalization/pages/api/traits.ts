import { NextApiHandler } from "next";
import getConfig from "next/config";
import axios from "axios";

const handleGet: NextApiHandler = async (req, res) => {
  const {
    serverRuntimeConfig: { segmentApiKey, segmentSpaceId },
  } = getConfig();

  if (!segmentApiKey || !segmentSpaceId) {
    return res
      .status(401)
      .json({ message: "Segment settings are not configured" });
  }

  const nextCookies = req.cookies;
  const ajs_anonymous_id = nextCookies.ajs_anonymous_id;

  if (!ajs_anonymous_id) {
    return res.status(401).json({
      message:
        "Segment identification hasn't taken place. No ajs_anonymous_id set",
    });
  }

  const url = `https://profiles.segment.com/v1/spaces/${segmentSpaceId}/collections/users/profiles/anonymous_id:${ajs_anonymous_id}/traits`;
  const basicAuth = Buffer.from(segmentApiKey + ":").toString("base64");
  let statusText;
  try {
    // IMPORTANT: using axios since standard fetch blows up parsing the response (something with gzip)
    const resp = await axios.get(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "accept-encoding": "gzip,deflate",
      },
    });
    res.status(200).json(resp.data);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      statusText,
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
