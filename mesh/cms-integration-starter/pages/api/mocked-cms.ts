import { NextApiRequest, NextApiResponse } from "next";
import { DEFAULT_API_KEY, HEADER_API_KEY } from "../../lib/constants";

// Mock database with sample data
// This is a simplified version of a CMS database with different content types
// Each content type has a list of entries with a published and unpublished version
// The API will return the published version of the entry by default
// If the state query parameter is set to "preview", the API will return the unpublished version of the entry
// The API supports listing all entries of a content type and fetching a single entry by ID
// The API key is used for authorization to access the API
// The API responds with JSON data for the requested content type and entry
// The API returns a 404 error if the content type or entry is not found
// The API returns a 400 error if the query parameters are invalid
// The API returns a 401 error if the API key is missing or incorrect
// The API is used to simulate a CMS integration for the CMS Mesh Integration example
// The API is used to fetch content from the mock database for the integration

const mockDatabase = {
  post: [
    {
      id: "1",
      published: { title: "Post 1", content: "This is post 1 published" },
      unpublished: { title: "Post 1", content: "This is post 1 published" },
    },
    {
      id: "2",
      published: { title: "Post 2", content: "This is post 2 published" },
      unpublished: { title: "Post 2", content: "This is post 2 unpublished" },
    },
    {
      id: "3",
      published: { title: "Post 3", content: "This is post 3 published" },
      unpublished: { title: "Post 3", content: "This is post 3 published" },
    },
    {
      id: "4",
      published: { title: "Post 4", content: "This is post 4 published" },
      unpublished: { title: "Post 4", content: "This is post 4 unpublished" },
    },
    {
      id: "5",
      published: { title: "Post 5", content: "This is post 5 published" },
      unpublished: { title: "Post 5", content: "This is post 5 published" },
    },
    {
      id: "6",
      published: { title: "Post 6", content: "This is post 6 published" },
      unpublished: { title: "Post 6", content: "This is post 6 unpublished" },
    },
    {
      id: "7",
      published: { title: "Post 7", content: "This is post 7 published" },
      unpublished: { title: "Post 7", content: "This is post 7 unpublished" },
    },
    {
      id: "8",
      published: { title: "Post 8", content: "This is post 8 published" },
      unpublished: { title: "Post 8", content: "This is post 8 published" },
    },
    {
      id: "9",
      published: { title: "Post 9", content: "This is post 9 published" },
      unpublished: { title: "Post 9", content: "This is post 9 unpublished" },
    },
    {
      id: "10",
      published: { title: "Post 10", content: "This is post 10 published" },
      unpublished: { title: "Post 10", content: "This is post 10 unpublished" },
    },
    {
      id: "11",
      published: { title: "Post 11", content: "This is post 11 published" },
      unpublished: { title: "Post 11", content: "This is post 11 published" },
    },
    {
      id: "12",
      published: { title: "Post 12", content: "This is post 12 published" },
      unpublished: { title: "Post 12", content: "This is post 12 unpublished" },
    },
    {
      id: "13",
      published: { title: "Post 13", content: "This is post 13 published" },
      unpublished: { title: "Post 13", content: "This is post 13 published" },
    },
    {
      id: "14",
      published: { title: "Post 14", content: "This is post 14 published" },
      unpublished: { title: "Post 14", content: "This is post 14 unpublished" },
    },
    {
      id: "15",
      published: { title: "Post 15", content: "This is post 15 published" },
      unpublished: { title: "Post 15", content: "This is post 15 unpublished" },
    },
    {
      id: "16",
      published: { title: "Post 16", content: "This is post 16 published" },
      unpublished: { title: "Post 16", content: "This is post 16 published" },
    },
    {
      id: "17",
      published: { title: "Post 17", content: "This is post 17 published" },
      unpublished: { title: "Post 17", content: "This is post 17 unpublished" },
    },
    {
      id: "18",
      published: { title: "Post 18", content: "This is post 18 published" },
      unpublished: { title: "Post 18", content: "This is post 18 unpublished" },
    },
    {
      id: "19",
      published: { title: "Post 19", content: "This is post 19 published" },
      unpublished: { title: "Post 19", content: "This is post 19 published" },
    },
    {
      id: "20",
      published: { title: "Post 20", content: "This is post 20 published" },
      unpublished: { title: "Post 20", content: "This is post 20 unpublished" },
    },
  ],
  page: [
    {
      id: "1",
      published: { title: "Page 1", content: "This is page 1 published" },
      unpublished: { title: "Page 1", content: "This is page 1 unpublished" },
    },
    {
      id: "2",
      published: { title: "Page 2", content: "This is page 2 published" },
      unpublished: { title: "Page 2", content: "This is page 2 unpublished" },
    },
    {
      id: "3",
      published: { title: "Page 3", content: "This is page 3 published" },
      unpublished: { title: "Page 3", content: "This is page 3 published" },
    },
    {
      id: "4",
      published: { title: "Page 4", content: "This is page 4 published" },
      unpublished: { title: "Page 4", content: "This is page 4 unpublished" },
    },
    {
      id: "5",
      published: { title: "Page 5", content: "This is page 5 published" },
      unpublished: { title: "Page 5", content: "This is page 5 unpublished" },
    },
    {
      id: "6",
      published: { title: "Page 6", content: "This is page 6 published" },
      unpublished: { title: "Page 6", content: "This is page 6 unpublished" },
    },
    {
      id: "7",
      published: { title: "Page 7", content: "This is page 7 published" },
      unpublished: { title: "Page 7", content: "This is page 7 unpublished" },
    },
    {
      id: "8",
      published: { title: "Page 8", content: "This is page 8 published" },
      unpublished: { title: "Page 8", content: "This is page 8 published" },
    },
    {
      id: "9",
      published: { title: "Page 9", content: "This is page 9 published" },
      unpublished: { title: "Page 9", content: "This is page 9 unpublished" },
    },
    {
      id: "10",
      published: { title: "Page 10", content: "This is page 10 published" },
      unpublished: { title: "Page 10", content: "This is page 10 unpublished" },
    },
  ],
  product: [
    {
      id: "1",
      published: {
        title: "Product 1",
        description: "This is product 1 published",
      },
      unpublished: {
        title: "Product 1",
        description: "This is product 1 unpublished",
      },
    },
    {
      id: "2",
      published: {
        title: "Product 2",
        description: "This is product 2 published",
      },
      unpublished: {
        title: "Product 2",
        description: "This is product 2 published",
      },
    },
    {
      id: "3",
      published: {
        title: "Product 3",
        description: "This is product 3 published",
      },
      unpublished: {
        title: "Product 3",
        description: "This is product 3 unpublished",
      },
    },
    {
      id: "4",
      published: {
        title: "Product 4",
        description: "This is product 4 published",
      },
      unpublished: {
        title: "Product 4",
        description: "This is product 4 unpublished",
      },
    },
    {
      id: "5",
      published: {
        title: "Product 5",
        description: "This is product 5 published",
      },
      unpublished: {
        title: "Product 5",
        description: "This is product 5 unpublished",
      },
    },
  ],
  blog: [
    {
      id: "1",
      published: { title: "Blog 1", content: "This is blog 1 published" },
      unpublished: { title: "Blog 1", content: "This is blog 1 published" },
    },
    {
      id: "2",
      published: { title: "Blog 2", content: "This is blog 2 published" },
      unpublished: { title: "Blog 2", content: "This is blog 2 unpublished" },
    },
    {
      id: "3",
      published: { title: "Blog 3", content: "This is blog 3 published" },
      unpublished: { title: "Blog 3", content: "This is blog 3 published" },
    },
    {
      id: "4",
      published: { title: "Blog 4", content: "This is blog 4 published" },
      unpublished: { title: "Blog 4", content: "This is blog 4 unpublished" },
    },
    {
      id: "5",
      published: { title: "Blog 5", content: "This is blog 5 published" },
      unpublished: { title: "Blog 5", content: "This is blog 5 unpublished" },
    },
  ],
};

const EXPECTED_API_KEY = DEFAULT_API_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, contentType, id } = req.query;

  // Authorization check
  if (req.headers[HEADER_API_KEY] !== EXPECTED_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validation for query params
  if (
    (state !== undefined && typeof state !== "string") ||
    typeof contentType !== "string" ||
    (id !== undefined && typeof id !== "string")
  ) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const isPreview = state === "preview";

  // Content type validation
  const content = mockDatabase[contentType];
  if (!content) {
    return res.status(404).json({ error: "Content type not found" });
  }

  // Handling requests with an ID parameter
  if (id) {
    const entry = content.find((item) => item.id === id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    const result = isPreview
      ? entry.unpublished || entry.published
      : entry.published;
    if (!result) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Responding with the found entry
    return res.status(200).json({ ...result, id });
  }

  // Handling requests without an ID parameter (listing all entries)
  const entries = content.map((item) => {
    const { id, published, unpublished } = item;
    const entry = isPreview ? unpublished || published : published;
    return { ...entry, id };
  });

  // Responding with the list of entries
  return res.status(200).json(entries);
}
