import type { NextApiRequest, NextApiResponse } from "next";
import { fetchStaticState } from "@/lib/coveo/engine-definition";

/**
 * Returns Coveo SSR static state for the given pipeline.
 * Used by SearchPageProviderWithState on the client to hydrate the search page.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const pipeline =
    typeof req.query.pipeline === "string" ? req.query.pipeline : undefined;
  try {
    const staticState = await fetchStaticState(pipeline);
    return res.status(200).json(staticState);
  } catch (err) {
    console.error("[alex] coveo-static-state error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
