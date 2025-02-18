import { SearchResultsWithPagination, SearchResult } from "@/types/search";
import {
  CANVAS_PUBLISHED_STATE,
  ContentClient,
} from "@uniformdev/canvas";

export enum UniformContentType {
  ARTICLE = "article",
}
const getContentClient = () => {
  return new ContentClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
  });
};

export const getMemoizedContentClient = (() => {
  let contentClient: ContentClient;
  return () => {
    if (!contentClient) contentClient = getContentClient();
    return contentClient;
  };
})();

export const getKnowledgeBaseArticles = async ({
  page = 0,
  perPage = 10,
  filters = {},
  search = "",
  orderBy,
  facetFields = [],
}: {
  page?: number;
  perPage?: number;
  preview?: boolean;
  filters?: any;
  search?: string;
  orderBy?: string;
  facetFields?: string[]; // Renamed from `facets` to `facetFields`
}): Promise<SearchResultsWithPagination> => {
  const response = await getMemoizedContentClient().getEntries({
    filters: {
      ...filters,
      type: { eq: UniformContentType.ARTICLE },
    },
    state: CANVAS_PUBLISHED_STATE,
    skipPatternResolution: true,
    resolutionDepth: 2,
    limit: perPage,
    offset: page * perPage,
    search,
    orderBy: orderBy ? [orderBy] : ["updated_at_ASC"],
    withTotalCount: true,
    facetBy: facetFields.join(","), // Use join to create comma-separated string if necessary
  });

  const { facets } = response as any; // Facets in response remain unchanged
  const items: SearchResult[] = response.entries.map(
    (entryResponse: any) => {
      const entry = entryResponse.entry;
      return {
        id: entry._id,
        title: entry.fields.title.value,
        description: entry.fields.description,
        slug: entry._slug || undefined,
        contentType: entry.type,
      };
    }
  );

  return {
    items: items,
    page,
    perPage,
    totalCount: response.totalCount!,
    facets: facets, // Return response facets
  };
};
