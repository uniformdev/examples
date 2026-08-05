import {
  ResolveComponentFunction,
  type ResolveComponentResult,
} from "@uniformdev/next-app-router";
import { ComponentProps } from "@uniformdev/next-app-router/component";

import { HeroComponent } from "./hero";
import { Page } from "./page";
import { HeaderComponent } from "./header";
import { FooterComponent } from "./footer";
import { PaginatedList } from "./paginatedList";
import { PaginationContainer } from "./paginationContainer";
import { Card } from "./card";

const componentMap: Record<string, ResolveComponentResult["component"]> = {
  page: Page,
  hero: HeroComponent,
  header: HeaderComponent,
  footer: FooterComponent,
  paginatedList: PaginatedList,
  paginationContainer: PaginationContainer,
  card: Card,
};

const DefaultNotFoundComponent = ({ type }: ComponentProps) => {
  return (
    <div>
      Component "{type}" couldn't be resolved as it is not mapped in the
      resolveComponent function yet.
    </div>
  );
};

export const resolveComponent: ResolveComponentFunction = ({ component }) => ({
  component: componentMap[component.type] ?? DefaultNotFoundComponent,
});
