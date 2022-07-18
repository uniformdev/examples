const handler = async (req, res) => {
  // NOTE: in production, get this from the next config API
  const previewSecret = process.env.UNIFORM_PREVIEW_SECRET;

  if (!req.query.slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  // raw string of the incoming slug
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;

  // /api/preview?disable=true&slug=/return/to/this to turn off preview mode
  if (req.query.disable) {
    res.clearPreviewData();
    res.redirect(slug);
    return;
  }

  if (req.query.secret !== previewSecret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // enable preview mode and redirect to the slug to preview
  res.setPreviewData({});
  res.redirect(slug);
};

export default handler;
