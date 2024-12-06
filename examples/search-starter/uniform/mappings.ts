import SearchComponent from "../components/search";
import { ResolveComponentResultWithType } from "./models";

// components will be registered here
export { pageMapping } from "../components/page/mapping";
export { heroMapping } from "../components/hero/mapping";
export { searchHeroMapping } from "../components/searchHero";
export { headerMapping } from "../components/header";
export { footerMapping } from "../components/footer";

export const searchMapping: ResolveComponentResultWithType = {
    type: "search",
    component: SearchComponent,
};