import { ComponentInstance } from "@uniformdev/canvas";
import { ComponentProps } from "@uniformdev/canvas-react";
import { Default } from "../components/Default";

import { Hero } from "../components/Hero";
import { CTA } from "../components/CTA";
import { GenericGrid } from "../components/GenericGrid";
import { GenericCard } from "../components/GenericCard";
import { OfferingCard } from "../components/OfferingCard";
import { OfferingGrid } from "../components/OfferingGrid";

// Resolve Render function
export function componentResolutionRenderer(
  component: ComponentInstance
): React.ComponentType<ComponentProps<any>> {
  switch (component.type) {
    case "hero":
      return Hero;
    case "callToAction":
      return CTA;
    case "genericCard":
      return GenericCard;
    case "genericGrid":
      return GenericGrid;
    case "offeringCard":
      return OfferingCard;
    case "offeringGrid":
      return OfferingGrid;
    default:
      return Default;
  }
}
