import { ComponentInstance } from "@uniformdev/canvas";
import { convertComponentToProps, useUniformCurrentComponent } from "@uniformdev/canvas-react";
import { ComponentType } from "react";

export const useTemplateComponentFromSlot = (rootComponent: ComponentInstance, templateSlot: string): {
    props?: Record<string, unknown>;
    Component?: ComponentType<any> | null;
} => {
    const { resolveRenderer } = useUniformCurrentComponent();

    const componentInstance = rootComponent?.slots?.[templateSlot]?.at(0);
    const Component = componentInstance ? resolveRenderer?.(componentInstance) : undefined;

    if (!componentInstance || !Component) {
        return {};
    }

    const { component: _, ...props } = convertComponentToProps(componentInstance);

    return {
        props,
        Component,
    }
}