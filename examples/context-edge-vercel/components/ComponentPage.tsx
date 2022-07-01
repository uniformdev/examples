import { createElement } from "react";
import { ComponentType, Page } from "../lib/models";

export type PageProps = { page: Page };

export const ComponentPage = ({
  page,
  componentMapping
}: PageProps & {
  componentMapping: Partial<Record<ComponentType, React.ComponentType<any>>>
}) => (
  <>
    {page?.components &&
      page.components.map((component, index) =>
        createElement(componentMapping[component.type] ?? (() => null), {
          key: index,
          ...component,
        })
      )}
  </>
)