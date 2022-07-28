import { NextApiHandler } from "next";
import getConfig from "next/config";

const handler: NextApiHandler = async (req, res) => {
  const {
    serverRuntimeConfig: { previewSecret },
  } = getConfig();

  if (!req.query.slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  // raw string of the incoming slug
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;

  if (req.query.disable) {
    res.clearPreviewData();
    res.redirect(slug);
    return;
  }

  if (req.query.secret !== previewSecret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // enable preview mode and redirect to the slug to preview
  res.setPreviewData({ yay: "tacos" });
  res.redirect(slug);
};

export default handler;
