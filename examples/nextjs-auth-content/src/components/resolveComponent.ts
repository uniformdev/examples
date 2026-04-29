import {
  ResolveComponentFunction,
  type ResolveComponentResult,
} from "@uniformdev/next-app-router";

import { DefaultNotFoundComponent } from "./default";
import { HeroComponent } from "./hero";
import { Page } from "./page";
import { HeaderComponent } from "./header";
import { FooterComponent } from "./footer";
import { ComponentType } from "react"
import { ComponentProps } from "@uniformdev/next-app-router/component"
import { AuthContainer } from "../components/AuthContainer"
import { Content } from "../components/Content"

const components = new Map<string, ComponentType<ComponentProps<any, any>>>([
  ['authContainer', AuthContainer],
  ['content', Content],
  ['page', Page],
  ['hero', HeroComponent],
  ['header', HeaderComponent],
  ['footer', FooterComponent],
])

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  let result: ResolveComponentResult | undefined;
  const found = components.get(component.type)

  if (found) {
    result = {
      component: found,
    };
  }

  return (
    result || {
      component: DefaultNotFoundComponent,
    }
  );
};
