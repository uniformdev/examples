import { createSearchClient } from '@uniformdev/search';

export const { performSearch } = createSearchClient({
  apiUrl: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_URL || '',
  apiKey: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_KEY,
  projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
});
