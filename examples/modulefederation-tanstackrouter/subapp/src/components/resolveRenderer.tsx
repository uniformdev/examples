import type { ComponentInstance } from "@uniformdev/canvas"
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-react"
import Page from "./uniform/Page.tsx"
import UniformPlans from "./uniform/Plans.tsx"
import Hero from "./uniform/Hero.tsx"
import CtaButton from "./uniform/CtaButton.tsx"

export function resolveRenderer (component: ComponentInstance) {
  switch (component.type) {
    case 'page':
      return Page;
    case 'plans':
      return UniformPlans;
    case 'hero':
      return Hero;
    case 'ctaButton':
      return CtaButton;
    default:
      return DefaultNotImplementedComponent;
  }
}
