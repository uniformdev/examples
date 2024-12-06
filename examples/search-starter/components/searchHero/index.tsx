import { ComponentProps } from "@uniformdev/canvas-next-rsc/component";

import { ResolveComponentResultWithType } from "@/uniform/models";

export type SearchHeroProps = {};

export const SearchHeroComponent = ({
  component,
  context,
}: ComponentProps<SearchHeroProps>) => {
  return null;
};

export const searchHeroMapping: ResolveComponentResultWithType = {
  type: "searchHero",
  component: SearchHeroComponent,
};
