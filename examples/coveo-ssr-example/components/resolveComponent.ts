import {
  ResolveComponentFunction,
  type ResolveComponentResult,
} from "@uniformdev/next-app-router";

import { DefaultNotFoundComponent } from "./default";
import { HeroComponent } from "./hero";
import { Page } from "./page";
import { SearchContainer } from "./search/SearchContainer";
import { SearchBar } from "./search/SearchBar";
import { SearchResults } from "./search/SearchResults";
import { SearchToolbar } from "./search/SearchToolbar";
import { SearchFacets } from "./search/SearchFacets";

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  let result: ResolveComponentResult | undefined;

  if (component.type === "page") {
    result = {
      component: Page,
    };
  } else if (component.type === "hero") {
    result = {
      component: HeroComponent,
    };
  } else if (component.type === "searchContainer") {
    result = {
      component: SearchContainer,
    };
  } else if (component.type === "searchBar") {
    result = {
      component: SearchBar,
    };
  } else if (component.type === "searchResults") {
    result = {
      component: SearchResults,
    };
  } else if (component.type === "searchToolbar") {
    result = {
      component: SearchToolbar,
    };
  } else if (component.type === "searchFacets") {
    result = {
      component: SearchFacets,
    };
  }

  return (
    result || {
      component: DefaultNotFoundComponent,
    }
  );
};
