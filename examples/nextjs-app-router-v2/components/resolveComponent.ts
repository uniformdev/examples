import {
  ResolveComponentFunction,
  type ResolveComponentResult,
} from "@uniformdev/canvas-next-rsc-v2";

import { DefaultNotFoundComponent } from "./default";
import { HeroComponent } from "./hero";
import { Page } from "./page";
import { HeaderComponent } from "./header";
import { FooterComponent } from "./footer";

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
  } else if (component.type === "header") {
    result = {
      component: HeaderComponent,
    };
  } else if (component.type === "footer") {
    result = {
      component: FooterComponent,
    };
  }

  return (
    result || {
      component: DefaultNotFoundComponent,
    }
  );
};
