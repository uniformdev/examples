import { getKnowledgeBaseArticles } from "@/uniform/search/client"; // adjust the path accordingly
import { SearchResultsWithPagination } from "@/types/search"; // adjust according to where your types are defined
import { NextRequest, NextResponse } from "next/server";

export const GET = async function handler(req: NextRequest) {
  if (req.method === "GET") {
    try {
      // Parse the URL to extract search parameters
      const url = new URL(req.url);
      const searchParams = url.searchParams;
      const facetBy = searchParams.get("facetBy") ?? "";
      const facetByFields = facetBy
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0);

      // Extract query parameters from the searchParams with default values
      const page = Number(searchParams.get("page")) || 0;
      const perPage = Number(searchParams.get("perPage")) || 10;
      const search = searchParams.get("search") || "";
      const filters = searchParams.get("filters") || "";
      const parsedFilters = filters ? JSON.parse(filters as string) : {};
      const orderBy = searchParams.get("orderBy") || "updated_at_ASC";
      console.log("parsedFilters", parsedFilters);
      const articles: SearchResultsWithPagination = await getKnowledgeBaseArticles({
        page: Number(page) || 0,
        perPage: Number(perPage) || 10,
        search: search?.toString() || "",
        filters: parsedFilters,
        orderBy: orderBy?.toString(),
        facetFields: facetByFields, // Pass the parsed facets
      });
      // Return JSON response using NextResponse
      return NextResponse.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
