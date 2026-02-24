import type { ComponentInstance } from "@uniformdev/canvas"
import Page from "./uniform/Page.tsx"
import Hero from "./uniform/Hero.tsx"
import { FederatedModuleComponent } from "./FederatedModule.tsx"
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-react"
import ModuleRootPage from "./uniform/ModuleRootPage.tsx"
import { SiteHeader } from "./ui/SiteHeader.tsx"
import { SiteFooter } from "./ui/SiteFooter.tsx"
import { ComponentType } from "react"

const components = new Map<string, ComponentType<any>>([
  ['page', Page],
  ['siteHeader', SiteHeader],
  ['siteFooter', SiteFooter],
  ['moduleRootPage', ModuleRootPage],
  ['hero', Hero],
  ['federatedModule', FederatedModuleComponent],
])

export function resolveRenderer (component: ComponentInstance) {
  return components.get(component.type) ?? DefaultNotImplementedComponent
}
