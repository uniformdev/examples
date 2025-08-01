import { ComponentProps } from "@uniformdev/canvas-react";

export type PageParameters = {
  pageTitle?: string;
  backgroundColor?: string;
};

export enum CommonPageSlots {
  PageContent = "pageContent",
  PageHeader = "pageHeader",
  PageFooter = "pageFooter",
}

export type PageProps = ComponentProps<PageParameters>;

export { default } from "./page";
