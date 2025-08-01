import { ComponentProps, DefaultNotImplementedComponent, RenderComponentResolver } from "@uniformdev/canvas-react";
import Page from "./page";

type ComponentMapping = Record<string, React.ComponentType<ComponentProps<any>>>;

const createComponentResolver =
  (mappings: ComponentMapping): RenderComponentResolver =>
  component =>
    mappings[component.type] || DefaultNotImplementedComponent;

const componentMapping: ComponentMapping = {
  page: Page,
};

export default createComponentResolver(componentMapping);
