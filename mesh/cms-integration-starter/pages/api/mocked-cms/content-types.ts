import { NextApiRequest, NextApiResponse } from "next";
import { DEFAULT_API_KEY, HEADER_API_KEY } from "../../../lib/constants";

// This is a mocked API route that returns a list of content types.
// It is used to simulate fetching the content types from the CMS API.
// In a real-world scenario, you would fetch the content types from the CMS API.
// The content types are used to filter the data from the CMS API.

const mockDatabase = {
  types: ["post", "page", "product", "blog"],
};

const EXPECTED_API_KEY = DEFAULT_API_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) { 
  // Authorization check
  if (req.headers[HEADER_API_KEY] !== EXPECTED_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json(mockDatabase.types);
}
