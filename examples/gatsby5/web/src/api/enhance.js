import { enhanceComposition } from "../lib/canvas";

export default async function API(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { composition } = req.body || {};

  if (!composition) {
    res.status(400).json({ error: "Missing composition" });
    return;
  }

  await enhanceComposition(composition);

  res.status(200).json({ composition });
}
