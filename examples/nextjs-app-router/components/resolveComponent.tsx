import {
  ResolveComponentFunction,
  type ResolveComponentResult,
} from "@uniformdev/next-app-router";
import { ComponentProps } from "@uniformdev/next-app-router/component";

import { HeroComponent } from "./hero";
import { Page } from "./page";
import { HeaderComponent } from "./header";
import { FooterComponent } from "./footer";
import { ParentLabel } from "./parentLabel";
import type { WithParentComponent } from "@/lib/uniform/dataClient";

const componentMap: Record<string, ResolveComponentResult["component"]> = {
  page: Page,
  hero: HeroComponent,
  header: HeaderComponent,
  footer: FooterComponent,
};

const DefaultNotFoundComponent = ({
  type,
  parameters,
}: ComponentProps<WithParentComponent>) => {
  return (
    <div>
      Component "{type}" couldn't be resolved as it is not mapped in the
      resolveComponent function yet.
      <ParentLabel parent={parameters.parentComponent} />
    </div>
  );
};

export const resolveComponent: ResolveComponentFunction = ({ component }) => ({
  component: componentMap[component.type] ?? DefaultNotFoundComponent,
});
