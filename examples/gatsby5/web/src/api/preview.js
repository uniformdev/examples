export default function API(req, res) {
  const slug = req.query ? req.query["slug"] : "/";
  let redirectPath;

  if (slug === "/") {
    redirectPath = "/";
  } else {
    redirectPath = `/${slug}/`;
  }
  const redirectUrl = `${redirectPath}?is_incontext_editing_mode=true`;
  res.redirect(redirectUrl);
}
