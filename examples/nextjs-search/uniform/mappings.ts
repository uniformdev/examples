import { ResolveComponentResultWithType } from "@/uniform/models";
export { pageMapping } from "../components/page/mapping";
import { SearchContainer } from "../components/Search/SearchContainer";
import { SearchResultCard } from "../components/Search/SearchResultCard";

// components will be registered here
export const searchContainerMapping: ResolveComponentResultWithType = {
    type: "searchContainer",
    component: SearchContainer,
};

export const searchResultCardMapping: ResolveComponentResultWithType = {
    type: "searchResultCard",
    component: SearchResultCard,
};