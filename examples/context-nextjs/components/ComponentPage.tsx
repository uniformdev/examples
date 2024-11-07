import { createElement } from "react";
import { Page } from "../lib/models";
import componentMapping from "./componentMapping";
import { CalloutTest } from "./Callout";

export type PageProps = { page: Page };

export const ComponentPage = ({ page }: PageProps) => (
  <>
    {page?.components &&
      page.components.map((component, index) =>
        createElement(componentMapping[component.type] ?? (() => null), {
          key: index,
          ...component,
        })
      )}
    <CalloutTest />
  </>
);
