import { DefaultNotImplementedComponent } from "@uniformdev/canvas-react";
import Page from "./Page";
import Hero from "./Hero";
import { ComponentInstance } from "@uniformdev/canvas";

function resolveRenderer(component: ComponentInstance) {
    switch (component.type) {
        case 'hero':
            return Hero;
        case 'page':
            return Page;
        default:
            return DefaultNotImplementedComponent;
    }
}
export { resolveRenderer };