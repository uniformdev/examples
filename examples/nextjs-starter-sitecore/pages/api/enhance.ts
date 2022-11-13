import { NextApiRequest, NextApiResponse } from "next";
import { RootComponentInstance, generateHash } from "@uniformdev/canvas";
import getConfig from "next/config";
import runEnhancers from "lib/uniform/enhancers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not supported." });
  }

  // eslint-disable-next-line prefer-destructuring
  const body:
    | {
        composition: RootComponentInstance;
        hash: number;
      }
    | undefined = req.body;

  if (!body?.composition) {
    return res.status(400).json({ message: "Missing composition" });
  }

  const {
    serverRuntimeConfig: { previewSecret },
  } = getConfig();

  const { composition } = body;
  const hasProvidedHash = Boolean(body.hash);
  const hasConfiguredHash = Boolean(previewSecret);

  if (hasProvidedHash && hasConfiguredHash) {
    const calculatedHash = generateHash({
      composition,
      secret: previewSecret,
    });

    if (calculatedHash !== body.hash) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else if (hasConfiguredHash) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await runEnhancers(composition, true);

  return res.status(200).json({
    composition,
  });
};
